output "public_ip" {
  description = "Public IP address of the portfolio VM"
  value       = azurerm_public_ip.portfolio.ip_address
}