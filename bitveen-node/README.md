## Bitveen Fix Node Server Issues by PORT redirection
## To fix : This site can’t be reached
## Whenever AWS instance restart of Bitveen.com - we need to run below commands:
sudo pm2 status
sudo iptables -t nat -L
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8000
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-ports 8443

## Something else