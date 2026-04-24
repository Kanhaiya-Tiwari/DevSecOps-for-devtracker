from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from uuid import UUID

from app.dependencies import get_db, get_current_user
from app.models.blog import Blog, BlogComment
from app.models.user import User

router = APIRouter()


class BlogCreate(BaseModel):
    title: str
    content: str
    cover_image: Optional[str] = None


class BlogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None


class CommentResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    content: str
    created_at: str

    class Config:
        from_attributes = True


class BlogResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    title: str
    content: str
    cover_image: Optional[str]
    likes_count: int
    comments_count: int
    comments: list[CommentResponse] = []
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=str(obj.id),
            user_id=str(obj.user_id),
            user_name=obj.user.name if obj.user else "Unknown",
            title=obj.title,
            content=obj.content,
            cover_image=obj.cover_image,
            likes_count=obj.likes_count or 0,
            comments_count=len(obj.comments) if obj.comments else 0,
            comments=[
                CommentResponse(
                    id=str(c.id),
                    user_id=str(c.user_id),
                    user_name=c.user.name if c.user else "Unknown",
                    content=c.content,
                    created_at=c.created_at.isoformat()
                ) for c in (obj.comments or [])
            ],
            created_at=obj.created_at.isoformat() if obj.created_at else None,
            updated_at=obj.updated_at.isoformat() if obj.updated_at else None
        )


@router.get("/", response_model=list[BlogResponse])
async def get_blogs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Blog)
        .options(selectinload(Blog.user), selectinload(Blog.comments).selectinload(BlogComment.user))
        .order_by(Blog.created_at.desc())
    )
    blogs = result.scalars().all()
    return [BlogResponse.from_orm(blog) for blog in blogs]


@router.post("/", response_model=BlogResponse)
async def create_blog(
    blog: BlogCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_blog = Blog(
        user_id=current_user.id,
        title=blog.title,
        content=blog.content,
        cover_image=blog.cover_image
    )
    db.add(new_blog)
    await db.commit()
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Blog)
        .where(Blog.id == new_blog.id)
        .options(selectinload(Blog.user))
    )
    new_blog = result.scalar_one()
    return BlogResponse.from_orm(new_blog)


@router.get("/{blog_id}", response_model=BlogResponse)
async def get_blog(
    blog_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Blog)
        .where(Blog.id == UUID(blog_id), Blog.user_id == current_user.id)
    )
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    return BlogResponse.from_orm(blog)


@router.put("/{blog_id}", response_model=BlogResponse)
async def update_blog(
    blog_id: str,
    blog_update: BlogUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Blog)
        .where(Blog.id == UUID(blog_id), Blog.user_id == current_user.id)
    )
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )

    if blog_update.title is not None:
        blog.title = blog_update.title
    if blog_update.content is not None:
        blog.content = blog_update.content
    if blog_update.cover_image is not None:
        blog.cover_image = blog_update.cover_image

    await db.commit()
    await db.refresh(blog)
    return BlogResponse.from_orm(blog)


@router.delete("/{blog_id}")
async def delete_blog(
    blog_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Blog)
        .where(Blog.id == UUID(blog_id), Blog.user_id == current_user.id)
    )
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )

    await db.delete(blog)
@router.post("/{blog_id}/like")
async def like_blog(
    blog_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Blog).where(Blog.id == UUID(blog_id)))
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    blog.likes_count = (blog.likes_count or 0) + 1
    db.add(blog)
    await db.commit()
    return {"status": "success", "likes": blog.likes_count}


@router.post("/{blog_id}/comment")
async def add_comment(
    blog_id: str,
    content: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Blog).where(Blog.id == UUID(blog_id)))
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    comment = BlogComment(
        blog_id=UUID(blog_id),
        user_id=current_user.id,
        content=content
    )
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return {"status": "success", "comment": content}
