# mitsuri

An all purpose discord bot

![mitsuri](https://media.discordapp.net/attachments/790703174746636328/1040057921947578408/tumblr_4ddb73070eb53c6a0b0dea43cc2781cd_c1cecc63_1280_cropped.png)

---

## [Click To Invite To A Server](https://discord.com/api/oauth2/authorize?client_id=969343378535903262&scope=applications.commands)

---

## Commands

### `/ryangif`

Sends a random gif from ryan's saved gifs

---

### `/ask`

Ask mitsuri a question and see what she says

**Parameters:**

- **(required)** String: question text

---

### `/greet`

Sends a greeting

**Parameters:**

- **(optional)** User: user to greet **(defaults to self)**

---

### `/prompt`

Sends a random art prompt

**Parameters:**

- **(required)** String Selector: 
  - Characters
  - Animals
  - Situations
  - Objects

---

### `/dap`

Daps a user up

**Parameters:**

- **(optional)** User: user to dap **(defaults to self)**

---

### `/hug`

Hugs a user

**Parameters:**

- **(optional)** User: user to hug **(defaults to self)**

---

### `/paint`

Paints a picture for a user utilizing the openai dalle api

**Parameters:**

- **(required)** String: prompt text

---

### `/version`

Sends the current build version and a link to the changelogs

---

### `/talk`

Allows a user to talk to mitsuri utilizing the openai davinci text model

**Parameters:**

- **(required)** String: text to say to mitsuri

---

### `/ping`

Allows the user to retrieve the heartbeat and roundtrip pings of mitsuri

**Parameters:**

- **(required)** String selector:
  - Heartbeat
  - Roundtrip
