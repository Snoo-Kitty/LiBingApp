# .env variables
| Field         | Value                                                                        | Type        |
|---------------|------------------------------------------------------------------------------|-------------|
| TOKEN         | The bots access token                                                        | str         |
| ID            | The application ID                                                           | str         |
| PROTECT       | Use XOR encryption for generated data                                        | bool        |
| PREFIX        | The prefix the bot will use for commands                                     | str         |
| DEVELOPMENTWL | The user ID list whitelisted for using commands with property wlrequire=true | str,str,... |
| SEED          | The seed used for XOR encryption (Automatically generated)                   | str(number) |
| USE_MONGO     | Use mongoDB for generated data                                               | bool        |
| DATABASE_URL  | The URL of mongoDB instance                                                  | str         |