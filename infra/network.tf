# ============================================================
# Resource Group
# ============================================================

resource "azurerm_resource_group" "portfolio" {
  name     = "portfolio-rg"
  location = "Central India"
}


# ============================================================
# Network Security Group
# ============================================================

resource "azurerm_network_security_group" "portfolio" {
  name                = "portfolio-nsg"
  location            = azurerm_resource_group.portfolio.location
  resource_group_name = azurerm_resource_group.portfolio.name
}


# ============================================================
# NSG Rule: SSH
# ============================================================

resource "azurerm_network_security_rule" "ssh" {
  name                        = "allow-ssh"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "22"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.portfolio.name
  network_security_group_name = azurerm_network_security_group.portfolio.name
}


# ============================================================
# NSG Rule: HTTP
# ============================================================

resource "azurerm_network_security_rule" "http" {
  name                        = "allow-http"
  priority                    = 110
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "80"
  source_address_prefix      = "*"
  destination_address_prefix = "*"
  resource_group_name         = azurerm_resource_group.portfolio.name
  network_security_group_name = azurerm_network_security_group.portfolio.name
}


# ============================================================
# NSG Rule: HTTPS
# ============================================================

resource "azurerm_network_security_rule" "https" {
  name                        = "allow-https"
  priority                    = 120
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "443"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.portfolio.name
  network_security_group_name = azurerm_network_security_group.portfolio.name
}


# ============================================================
# Virtual Network
# ============================================================

resource "azurerm_virtual_network" "portfolio" {
  name                = "portfolio-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.portfolio.location
  resource_group_name = azurerm_resource_group.portfolio.name
}


# ============================================================
# Subnet
# ============================================================

resource "azurerm_subnet" "portfolio" {
  name                 = "portfolio-subnet"
  resource_group_name  = azurerm_resource_group.portfolio.name
  virtual_network_name = azurerm_virtual_network.portfolio.name
  address_prefixes     = ["10.0.1.0/24"]
}


# ============================================================
# NSG -> Subnet Association
# ============================================================

resource "azurerm_subnet_network_security_group_association" "portfolio" {
  subnet_id                 = azurerm_subnet.portfolio.id
  network_security_group_id = azurerm_network_security_group.portfolio.id
}