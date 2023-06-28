module.exports = {
  apps: [
    {
      name: "bira-beast",
      script: "npm run start",
      watch: false,
      "error_file" : "/var/log/pm2_log/bira-beast/error.log",
      "out_file" : "/var/log/pm2_log/bira-beast/output.log",
      "env": {
        "NODE_ENV": "default",
      },
      "env_dev": {
        "PORT": 3000,
        "NODE_ENV": "development",
      },
      "env_develop": {
        "PORT": 3000,
        "NODE_ENV": "development",
      },
      "env_prod": {
        "PORT": 3000,
        "NODE_ENV": "production",
      },
      "env_dev2": {
        "PORT": 3000,
        "NODE_ENV": "local_development",
      },
    },          
  ],

  deploy: {
    develop: {
      user: "ubuntu",
      host: "13.235.84.182",
      path: "/home/ubuntu/bira_stp_10282_beast_dev",
      repo: "git@bitbucket.org:spurtreetech/stp_10282_bira_beast.git",
      ref: "origin/develop",
      key: "/var/lib/jenkins/sttdevops",
      "post-deploy": "npm i; pm2 reload ecosystem.config.js --only bira-beast --env develop ",
    },    
  },
};