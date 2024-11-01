# redis-node

## SSH Connection to EC2 Instance

Follow these steps to connect to our EC2 instance.

### Prerequisites
- Make sure you have your private key file (`redis-server.pem`) downloaded and accessible.

### Steps to Connect

1. **Set Permissions for the Private Key File**
   Run the following command to ensure your key is not publicly viewable:
   ```bash
   chmod 400 "redis-server.pem"
2. **example**
   ```bash
   ssh -i "redis-server.pem" ubuntu@vpcaddress
3. **to connect with redis database through CLI**
   ```bash
   redis-cli -u redis://default:password@redis-16001.c301.ap-south-1-1.ec2.redns.redis-cloud.com:port
