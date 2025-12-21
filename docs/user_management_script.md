# Quick DoD commands to run

```bash
# list users (now includes groups)
python backend/manage_users.py list

# create contractor
python backend/manage_users.py create test@example.com pass --groups contractor

# wipe (safe prompt)
python backend/manage_users.py wipe

# wipe (no prompt)
python backend/manage_users.py wipe --yes
```