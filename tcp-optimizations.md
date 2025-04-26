# TCP Optimizations for Production Server

To ensure stable Socket.IO connections in production, apply these TCP kernel parameter optimizations to your server:

## Add to /etc/sysctl.conf or create a new file in /etc/sysctl.d/

```
net.ipv4.ip_local_port_range=1024 65000
net.ipv4.tcp_tw_reuse=1
net.ipv4.tcp_fin_timeout=15
net.core.netdev_max_backlog=4096
net.core.rmem_max=16777216
net.core.somaxconn=4096
net.core.wmem_max=16777216
net.ipv4.tcp_max_syn_backlog=20480
net.ipv4.tcp_max_tw_buckets=400000
net.ipv4.tcp_no_metrics_save=1
net.ipv4.tcp_rmem=4096 87380 16777216
net.ipv4.tcp_syn_retries=2
net.ipv4.tcp_synack_retries=2
net.ipv4.tcp_wmem=4096 65536 16777216
vm.min_free_kbytes=65536
```

## Apply changes with:

```
sudo sysctl -p
```

## If using Nginx as a reverse proxy, add these settings:

```
http {
    # Other settings...
    
    # WebSocket configuration
    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }
    
    server {
        # Other settings...
        
        location /socket.io/ {
            proxy_pass http://your_backend_server;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            
            # Important timeouts for WebSockets
            proxy_read_timeout 300s;
            proxy_connect_timeout 300s;
            proxy_send_timeout 300s;
        }
    }
}
``` 