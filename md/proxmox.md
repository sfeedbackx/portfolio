# Proxmox Virtual Environment

Proxmox VE is an open-source, type-1 hypervisor based on Debian GNU/Linux. It provides a unified web interface for managing **KVM virtual machines** and **LXC containers**.

- **KVM** — Full virtualization: runs complete operating systems with their own kernel
- **LXC** — System containers: lightweight Linux environments sharing the host kernel

---

## Requirements

- USB flash drive (8 GB or larger)
- PC with virtualization support enabled (Intel VT-x or AMD-V) in BIOS/UEFI
- Minimum 2 GB RAM (4 GB+ recommended for real use)
- Ethernet cable for direct connection
- A second computer (Linux laptop) for management

---

## Installation

### 1. Download Required Software

- **Proxmox VE ISO:** https://www.proxmox.com/en/downloads
- **balenaEtcher:** https://etcher.balena.io/

### 2. Create Bootable USB

Open balenaEtcher:

```
Flash from file → select Proxmox ISO
Select target → choose USB drive
Flash!
```

### 3. Boot and Install

- Insert USB into the target PC
- Enter BIOS/UEFI (press `F2`, `F12`, or `Del` during boot)
- Set USB as first boot device
- Select "Install Proxmox VE (Graphical)"
- Follow the installer prompts:
  - Accept license agreement
  - Select target disk (the NVMe/SSD)
  - Set country, timezone, keyboard layout
  - Set root password and email
  - Set management IP (default: `192.168.100.2`)
  - Confirm and install

### 4. Verify Installation

After reboot, Proxmox shows a console screen with:

```
https://192.168.100.2:8006
```

This is the web management interface URL.

---

## Connecting Proxmox to Linux Machine

Access the Proxmox Web GUI from a Linux laptop via direct ethernet cable (no router needed).

### Why Direct Connection?

A direct ethernet connection is the simplest way to manage Proxmox when you don't have a router or switch. Both machines communicate on a private network (`192.168.100.x`).

---

### 1. Check Network Interfaces

On **Proxmox terminal**:

```bash
ip a
```

Look for:

- `vmbr0` — virtual bridge (has the Proxmox IP `192.168.100.2`)
- `enx000ec6aec768` — physical ethernet interface (state DOWN by default)

**What is a bridge?**
A network bridge connects multiple network interfaces at Layer 2 (data link layer), allowing them to function as a single network segment. `vmbr0` acts as a virtual switch — VMs, the physical port, and the host all connect through it.

---

### 2. Establish the Bridge

A **bridge** connects your physical ethernet port (`enx...`) to Proxmox's virtual switch (`vmbr0`) so traffic flows between your Linux laptop and Proxmox.

**Why we need this:**

- `vmbr0` has the IP but is isolated inside Proxmox
- `enx...` is the physical port but has no IP
- Bridging them together = traffic flows from cable into Proxmox

```bash
# Bring physical interface up
ip link set enx000ec6aec768 up

# Add physical interface into the bridge
brctl addif vmbr0 enx000ec6aec768

# Verify bridge is working
brctl show vmbr0
```

Expected output:

```
bridge name    bridge id          STP enabled    interfaces
vmbr0          8000.000ec6aec768  no             enx000ec6aec768
```

**What is STP?**
STP (Spanning Tree Protocol) prevents network loops in bridged environments. It's disabled here because we have a simple point-to-point connection with no loop risk.

---

### 3. Set IP on Linux Laptop (Host Machine)

On your **Linux laptop terminal**:

```bash
# Add IP address on ethernet interface
sudo ip addr add 192.168.100.3/24 dev enp4s0

# Bring the interface up
sudo ip link set enp4s0 up
```

**Why `192.168.100.3`?**

- Proxmox is on `192.168.100.2`
- Both devices must be on the same network `192.168.100.x`
- We pick `.3` for the laptop so there's no conflict

**How to find your ethernet interface name:**

```bash
ip link show
```

Look for the physical ethernet interface (not `lo` or `wlan`). Common names: `enp4s0`, `enp3s0`, `eth0`, `enx...`.

---

### 4. Add Route on Linux Laptop

```bash
sudo ip route add 192.168.100.0/24 dev enp4s0
```

**Why we need this:**

- Adding an IP alone doesn't tell Linux how to reach that network
- This route tells the laptop: "to reach anything on `192.168.100.x` → use `enp4s0` (ethernet)"

---

### 5. Verify Connectivity

```bash
# Test connection from Linux laptop to Proxmox
ping 192.168.100.2
```

If ping succeeds, the connection is working. If not, check:

```bash
# Verify interface is up
ip link show enp4s0

# Verify IP is assigned
ip addr show enp4s0

# Verify route exists
ip route show | grep 192.168.100

# Check cable is connected
ip link show enp4s0 | grep "state UP"
```

---

### 6. Access Proxmox Web GUI

Open browser on Linux laptop:

```
https://192.168.100.2:8006
```

- Click **Advanced → Proceed** on certificate warning (self-signed cert)
- Login:

```
Username: root
Password: [your install password]
```

---

### Network Diagram

```
Linux Laptop (192.168.100.3)
      │
      │ ethernet cable
      │
enx000ec6aec768 (physical port, no IP)
      │
      │ bridge (brctl addif)
      │
vmbr0 (192.168.100.2) ← Proxmox IP lives here
      │
      │
   Proxmox VMs (all on same vmbr0 bridge)
```

---

## Sharing Internet to Proxmox via USB Tethering

Give Proxmox and VMs internet access by sharing a phone's mobile data via USB tethering.

### Network Diagram

```
Internet
    │
    │ mobile data
    │
Redmi Phone
    │
    │ USB cable
    │
enxd261014b63ac (USB tethering interface on Proxmox)
    │
    │ NAT/IP forwarding
    │
vmbr0 (192.168.100.2)
    │
    ┌──────────────┐
    │              │
Parrot VM    Metasploitable VM
```

---

### 1. Enable USB Tethering on Phone

- Connect phone to Proxmox via USB cable
- Go to **Settings → More connections → USB tethering**
- Toggle **ON**
- Make sure **mobile data is ON**

---

### 2. Check Tethering Interface Appeared on Proxmox

```bash
ip a
```

Look for a new interface like `enxd261014b63ac` with an IP like `192.168.6.x`.

```bash
# Get IP automatically from phone
dhclient enxd261014b63ac
```

**What is DHCP?**
DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, gateways, and DNS servers to devices on a network. `dhclient` requests an IP from the DHCP server (your phone in this case).

---

### 3. Fix Default Route

By default Proxmox points its internet traffic to `192.168.100.1` which doesn't exist in our setup. We replace it with the phone gateway.

```bash
# Remove wrong default route
ip route del default via 192.168.100.1 dev vmbr0

# Add correct default route through phone
ip route add default via 192.168.6.1 dev enxd261014b63ac
```

**Why `192.168.6.1`?**

- When phone enables USB tethering it creates a mini network `192.168.6.x`
- Phone itself is at `192.168.6.1` acting as gateway
- All internet traffic goes through the phone to mobile network

Verify routes:

```bash
ip route show
```

Expected output:

```
default via 192.168.6.1 dev enxd261014b63ac
192.168.6.0/24 dev enxd261014b63ac
192.168.100.0/24 dev vmbr0
```

---

### 4. Test Proxmox Internet

```bash
# Add DNS
echo "nameserver 8.8.8.8" > /etc/resolv.conf

# Test connectivity
curl -I https://google.com
```

**What is DNS?**
DNS (Domain Name System) translates domain names (google.com) into IP addresses. `8.8.8.8` is Google's public DNS server.

**What is resolv.conf?**
`/etc/resolv.conf` tells Linux which DNS servers to use for name resolution. Without it, you can only reach machines by IP address.

---

### 5. Share Internet to VMs (IP Forwarding + NAT)

VMs are behind Proxmox on `vmbr0`. They can't reach the internet directly — Proxmox must act as a router for them.

```bash
# Step 1 — Enable IP forwarding
# Allows Proxmox to pass traffic between interfaces
echo 1 > /proc/sys/net/ipv4/ip_forward

# Step 2 — NAT outgoing traffic from VMs
# Replaces VM's private IP with Proxmox's phone IP
iptables -t nat -A POSTROUTING -o enxd261014b63ac -j MASQUERADE

# Step 3 — Allow traffic to flow both ways
iptables -A FORWARD -i vmbr0 -o enxd261014b63ac -j ACCEPT
iptables -A FORWARD -i enxd261014b63ac -o vmbr0 -j ACCEPT
```

**What each command does:**

| Command | Purpose |
|---|---|
| `ip_forward=1` | Makes Proxmox act as a router (pass traffic between interfaces) |
| `MASQUERADE` | Hides VM IPs behind Proxmox's phone IP (NAT) |
| `FORWARD vmbr0→enx` | Allows VM traffic OUT to internet |
| `FORWARD enx→vmbr0` | Allows internet replies back IN to VMs |

**What is NAT?**
NAT (Network Address Translation) rewrites the source IP address of outgoing packets. VMs have private IPs (`192.168.100.x`) that aren't routable on the internet — NAT replaces them with the phone's IP so traffic can reach the internet and return.

**What is iptables?**
`iptables` is the Linux kernel's firewall and traffic manipulation tool. It works by processing packets through chains of rules:

- **PREROUTING** — Modify packets as they arrive
- **FORWARD** — Decide what to do with packets passing through (routed)
- **POSTROUTING** — Modify packets as they leave

---

### 6. Configure VMs to Use Proxmox as Gateway

**On Parrot VM:**

```bash
# Set static IP
sudo ip addr add 192.168.100.20/24 dev ens18
sudo ip link set ens18 up

# Add route — use Proxmox as gateway
sudo ip route add 192.168.100.0/24 dev ens18
sudo ip route add default via 192.168.100.2

# Add DNS
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
```

**On Metasploitable:**

```bash
sudo ifconfig eth0 192.168.100.10 netmask 255.255.255.0
sudo route add default gw 192.168.100.2
```

**What is a static IP?**
A static IP is manually configured and doesn't change. DHCP-assigned IPs can change on reboot — static IPs are essential for servers and lab machines that other systems need to reach at a known address.

---

### 7. Test Internet on VMs

On Parrot:

```bash
# Test raw IP connectivity
ping 8.8.8.8

# Test DNS resolution
nslookup google.com

# Test HTTP connectivity
curl -I https://google.com

# Now install packages!
sudo apt update && sudo apt upgrade -y
```

---

## Important Notes

- All network settings above are **temporary** — lost on reboot
- `enx...` needs **no IP** — it just carries traffic into the bridge
- The IP lives on `vmbr0`, not on the physical interface
- Both devices must be on the same subnet `192.168.100.x/24`
- If phone disconnects → re-run `dhclient enxd261014b63ac`
- If route disappears → re-run `ip route add default via 192.168.6.1`

---

## Full Network Summary

```
Phone (192.168.6.1) ← mobile internet
    │
Proxmox (192.168.6.142) ← gets internet from phone
Proxmox (192.168.100.2) ← gateway for VMs
    │
    ├── Parrot VM (192.168.100.20)
    ├── Metasploitable (192.168.100.10)
    │
Linux Laptop (192.168.100.3) ← Proxmox Web GUI access
```

---

## Setting Up Virtual Machines in Proxmox

### Goal

Create two VMs for a red team vs. blue team lab:

- **Parrot OS** → attacker machine (red team)
- **Metasploitable 2** → vulnerable victim machine (blue team target)

---

### Part 1 — Parrot OS VM (Attacker)

#### 1. Download Parrot OS ISO

Download the **Security edition** from: https://parrotsec.org/download/

Choose: `Parrot Security ISO`

#### 2. Upload ISO to Proxmox

In Proxmox Web GUI:

```
Left panel → local storage → ISO Images → Upload → Select Parrot ISO
```

#### 3. Create the VM

Click **Create VM** in top right:

| Setting | Value |
|---|---|
| Name | parrot |
| ISO | Parrot Security ISO |
| OS Type | Linux |
| Disk | 20 GB |
| CPU | 2 cores |
| RAM | 2048 MB (2 GB) |
| Network | vmbr0 |

Click **Finish**

#### 4. Start and Install

- Click VM → **Start** → **Console**
- Follow Parrot installation wizard
- Set username and password
- Choose "Install with support for EFI" if prompted
- Set partition scheme (use entire disk)

#### 5. After Installation — Set Static Network

```bash
# Set IP
sudo ip addr add 192.168.100.20/24 dev ens18
sudo ip link set ens18 up

# Set gateway (Proxmox)
sudo ip route add 192.168.100.0/24 dev ens18
sudo ip route add default via 192.168.100.2

# Set DNS
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
```

#### 6. Make Network Persistent (Survives Reboot)

```bash
sudo nano /etc/network/interfaces
```

Add:

```
auto ens18
iface ens18 inet static
    address 192.168.100.20
    netmask 255.255.255.0
    gateway 192.168.100.2
    dns-nameservers 8.8.8.8
```

Save: `Ctrl+X` → `Y` → Enter

```bash
sudo systemctl restart networking
```

Verify:

```bash
ip addr show ens18
ip route show
cat /etc/resolv.conf
```

---

### Part 2 — Metasploitable 2 VM (Victim)

#### Why Metasploitable Is Different

Metasploitable 2 is not an ISO installer — it's a **pre-built virtual disk** (VMDK format). We can't upload it like a normal ISO. Instead we:

1. Transfer the VMDK file to Proxmox
2. Convert it to qcow2 (Proxmox native format)
3. Import it into a VM

#### 1. Download Metasploitable 2

Download from: https://sourceforge.net/projects/metasploitable/

Extract the zip → you get `Metasploitable.vmdk`

#### 2. Transfer VMDK to Proxmox

On **Linux laptop terminal**:

```bash
scp Metasploitable.vmdk root@192.168.100.2:/var/lib/vz/images/
```

**What is SCP?**
SCP (Secure Copy Protocol) copies files between two computers over SSH. It encrypts the data in transit, making it safe over any network.

**What if SCP is slow or fails?**

```bash
# Check SSH connectivity first
ssh root@192.168.100.2

# Try with verbose output for debugging
scp -v Metasploitable.vmdk root@192.168.100.2:/var/lib/vz/images/

# Alternative: use rsync for large files (resumable)
rsync -avP Metasploitable.vmdk root@192.168.100.2:/var/lib/vz/images/
```

#### 3. Convert VMDK to qcow2

On **Proxmox terminal**:

```bash
qemu-img convert -f vmdk -O qcow2 \
  /var/lib/vz/images/Metasploitable.vmdk \
  /var/lib/vz/images/metasploitable.qcow2
```

**Why we convert:**

| Format | Used by | Works in Proxmox? |
|---|---|---|
| VMDK | VMware/VirtualBox | Limited support |
| qcow2 | Proxmox/KVM | Native format — best performance |

**What is qcow2?**
qcow2 (QEMU Copy On Write version 2) is a disk image format that supports snapshots, compression, and thin provisioning. It only uses disk space for data that's actually written — not the full allocated size.

Verify conversion:

```bash
qemu-img info /var/lib/vz/images/metasploitable.qcow2
```

Should show `virtual size: 8 GiB`

#### 4. Create Empty VM

Click **Create VM** in Proxmox:

| Setting | Value |
|---|---|
| Name | metasploitable |
| OS | Do not use any media |
| Disk | Delete default disk |
| CPU | 1 core |
| RAM | 512 MB |
| Network | vmbr0 |

Note the **VM ID** (example: `102`)

Click **Finish**

#### 5. Import Converted Disk

On **Proxmox terminal**:

```bash
qm importdisk 102 /var/lib/vz/images/metasploitable.qcow2 local-lvm --format qcow2
```

**What this does:**

| Part | Meaning |
|---|---|
| `qm` | Proxmox VM management command-line tool |
| `importdisk` | Import an external disk image into a VM |
| `102` | VM ID (the one you noted in step 4) |
| `local-lvm` | Storage target in Proxmox |
| `--format qcow2` | Disk format to use |

**What if import fails?**

```bash
# Check available storage
pvesm status

# Check if file exists and is readable
ls -lh /var/lib/vz/images/metasploitable.qcow2

# Check VM exists
qm config 102
```

#### 6. Attach Disk in Proxmox UI

```
VM 102 → Hardware → Unused Disk 0 → Edit
    Bus/Device: IDE → IDE 0
    Click Add
```

**Why IDE and not SCSI or VirtIO?**

| Controller | Speed | Old OS Support |
|---|---|---|
| IDE | Slow | Yes |
| SCSI | Medium | Sometimes |
| VirtIO | Fast | No |

Metasploitable 2 is from **2012** — too old for modern controllers. IDE is the only one it reliably understands.

#### 7. Set Boot Order

```
VM 102 → Options → Boot Order
    Enable ide0 → move to first position
    Click OK
```

#### 8. Start VM and Login

- Click **Start** → **Console**
- Wait for boot

```
Username: msfadmin
Password: msfadmin
```

#### 9. Set Static IP on Metasploitable

```bash
sudo ifconfig eth0 192.168.100.10 netmask 255.255.255.0
sudo route add default gw 192.168.100.2
```

**Make it persistent:**

```bash
sudo nano /etc/network/interfaces
```

Add:

```
auto eth0
iface eth0 inet static
    address 192.168.100.10
    netmask 255.255.255.0
    gateway 192.168.100.2
```

```bash
sudo /etc/init.d/networking restart
```

---

### Part 3 — Verify VMs Can Communicate

#### Network Layout

```
Proxmox (192.168.100.2)
    │
    ├── Parrot OS      (192.168.100.20)  ← attacker
    └── Metasploitable (192.168.100.10)  ← victim
```

#### Test from Parrot → Metasploitable

```bash
ping 192.168.100.10
```

#### Test from Metasploitable → Parrot

```bash
ping 192.168.100.20
```

#### Scan Metasploitable from Parrot

```bash
nmap -sV 192.168.100.10
```

You should see many open ports — these are your attack targets!

---

## Troubleshooting

### Problem: Can't access Proxmox Web GUI

```bash
# On Linux laptop — check interface is up
ip link show enp4s0

# Check IP is assigned
ip addr show enp4s0

# Check route exists
ip route show | grep 192.168.100

# Test connectivity
ping 192.168.100.2

# On Proxmox — check bridge
brctl show vmbr0

# Check Proxmox firewall isn't blocking
pve-firewall status
```

### Problem: VMs can't reach internet

```bash
# On Proxmox — check IP forwarding is enabled
cat /proc/sys/net/ipv4/ip_forward
# Should show 1

# Re-enable if needed
echo 1 > /proc/sys/net/ipv4/ip_forward

# Check iptables rules
iptables -t nat -L -v
iptables -L FORWARD -v

# Check phone tethering interface
ip addr show enxd261014b63ac

# Re-request IP from phone
dhclient enxd261014b63ac
```

### Problem: Parrot and Metasploitable can't ping each other

```bash
# Verify both IPs are on same subnet
# Parrot: 192.168.100.20/24
# Metasploitable: 192.168.100.10/24

# Check Parrot's interface
ip addr show ens18

# Check Metasploitable's interface
ifconfig eth0

# Verify bridge on Proxmox
brctl show vmbr0

# Check Proxmox firewall
pve-firewall status
```

### Problem: Internet disappears after reboot

All the networking commands above are **temporary**. To make them persistent, you need to edit config files:

**On Proxmox (internet sharing):**

```bash
# Add to /etc/network/interfaces
auto enxd261014b63ac
iface enxd261014b63ac inet dhcp

# Enable IP forwarding permanently
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p

# Save iptables rules
iptables-save > /etc/iptables/rules.v4

# Install iptables-persistent to auto-load on boot
apt install iptables-persistent -y
```

**On Parrot VM:**

```bash
# Already covered in Part 1, Step 6
sudo nano /etc/network/interfaces
```

---

## Common Ports on Metasploitable 2

| Port | Service | Vulnerability |
|---|---|---|
| 21 | FTP (vsftpd 2.3.4) | Backdoor command execution |
| 22 | SSH | Weak/known credentials |
| 23 | Telnet | No encryption, weak credentials |
| 25 | SMTP | Open relay |
| 53 | DNS | DNS zone transfer possible |
| 80 | HTTP | Multiple web vulnerabilities |
| 111 | RPC | RPC DDoS / information disclosure |
| 139/445 | SMB | Multiple exploits (Samba) |
| 1524 | ingreslock | Root shell backdoor |
| 2049 | NFS | Unrestricted file sharing |
| 3306 | MySQL | No password / weak credentials |
| 5432 | PostgreSQL | Weak credentials |
| 5900 | VNC | No password / weak credentials |
| 6667 | IRC | IRC backdoor |

---

## Essential Proxmox Commands

### VM Management

```bash
# List all VMs and containers
qm list

# Start a VM
qm start <VMID>

# Stop a VM
qm stop <VMID>

# Shutdown a VM (graceful)
qm shutdown <VMID>

# Get VM status
qm status <VMID>

# Open VM console via terminal
qm terminal <VMID>

# Delete a VM
qm destroy <VMID

# Clone a VM
qm clone <VMID> <new-VMID> --name <new-name>

# Backup a VM
vzdump <VMID> --storage local --compress zstd
```

### Storage Management

```bash
# Check storage status
pvesm status

# List disks
lsblk

# Check disk usage
df -h

# Check LVM volumes
lvs

# Resize VM disk
qm resize <VMID> scsi0 +10G
```

### Network Management

```bash
# Show all interfaces
ip a

# Show all routes
ip route show

# Show bridge members
brctl show

# Restart networking
systemctl restart networking

# Check listening ports
ss -tlnp
```

### System Info

```bash
# Check Proxmox version
pveversion

# Check CPU usage
htop

# Check memory
free -h

# Check disk I/O
iostat -x 1

# Check kernel messages
dmesg | tail -20
```

---

## Proxmox Web GUI Quick Reference

| Task | Location in GUI |
|---|---|
| Create VM | Top right → "Create VM" |
| Upload ISO | Datacenter → Storage → local → ISO Images |
| Start/Stop VM | Select VM → toolbar buttons |
| Open Console | Select VM → "Console" |
| Edit Hardware | Select VM → Hardware |
| Take Snapshot | Select VM → Snapshots → Take Snapshot |
| Backup VM | Select VM → Backup → Backup Now |
| View Logs | Select VM → System → Syslog |
| Check Resources | Datacenter → Summary |

