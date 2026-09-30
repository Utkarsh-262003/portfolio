# ============================================================
# Public IP
# ============================================================

resource "azurerm_public_ip" "portfolio" {
  name                = "portfolio-public-ip"
  location            = azurerm_resource_group.portfolio.location
  resource_group_name = azurerm_resource_group.portfolio.name
  allocation_method   = "Static"
  sku                 = "Standard"
}


# ============================================================
# Network Interface
# ============================================================

resource "azurerm_network_interface" "portfolio" {
  name                = "portfolio-nic"
  location            = azurerm_resource_group.portfolio.location
  resource_group_name = azurerm_resource_group.portfolio.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.portfolio.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.portfolio.id
  }
}
# ============================================================
# Linux Virtual Machine
# ============================================================

resource "azurerm_linux_virtual_machine" "portfolio" {
  name                = "portfolio-vm"
  location            = azurerm_resource_group.portfolio.location
  resource_group_name = azurerm_resource_group.portfolio.name
  size                = "Standard_B2ats_v2"
  zone                =  "1"
  admin_username      = "azureuser"

  network_interface_ids = [
    azurerm_network_interface.portfolio.id
  ]

  admin_ssh_key {
    username   = "azureuser"
    public_key = file("${path.module}/keys/portfolio-key.pub")
  }

  disable_password_authentication = true

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "StandardSSD_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "ubuntu-24_04-lts"
    sku       = "server"
    version   = "latest"
  }
}