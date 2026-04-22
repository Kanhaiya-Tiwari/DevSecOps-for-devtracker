output "ec2_public_ip" {
  description = "Public IP of the DevTracker EC2 instance"
  value       = aws_instance.ec2.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS of the DevTracker EC2 instance"
  value       = aws_instance.ec2.public_dns
}

output "app_url" {
  description = "DevTracker app URL (available after bootstrap completes ~5-10 min)"
  value       = "http://${aws_instance.ec2.public_ip}"
}

output "ssh_command" {
  description = "SSH command to connect to the EC2 instance"
  value       = "ssh -i <your-key>.pem ubuntu@${aws_instance.ec2.public_ip}"
}

output "argocd_password_command" {
  description = "Run this command to get the ArgoCD initial admin password"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${aws_instance.ec2.public_ip} 'sudo KUBECONFIG=/etc/rancher/k3s/k3s.yaml kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=\"{.data.password}\" | base64 -d'"
}