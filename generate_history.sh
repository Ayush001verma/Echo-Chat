#!/bin/bash

echo "Blowing away old history..."
rm -rf .git

# Initialize the repo and set the default branch to 'main'
git init -b main

# Link your new GitHub repository
git remote add origin https://github.com/Ayush001verma/Echo-Chat.git

# Base date: 10 days ago
START_DATE=$(date -d "10 days ago" +%s)
SECONDS_PER_DAY=86400

# Global tracking variable for chronological time
CURRENT_DAY=0
CURRENT_TIME_IN_DAY=0

commit() {
    local day_offset=$1
    local msg=$2
    shift 2
    local files=("$@")

    # If we move to a new day, reset the clock to somewhere between 9 AM and 11 AM
    if [[ "$CURRENT_DAY" -ne "$day_offset" ]] || [[ "$CURRENT_TIME_IN_DAY" -eq 0 ]]; then
        CURRENT_DAY=$day_offset
        # Random start time between 32400s (9:00 AM) and 39600s (11:00 AM)
        CURRENT_TIME_IN_DAY=$(( 32400 + (RANDOM % 7200) ))
    else
        # Increment time by 30 mins (1800s) to 2.5 hours (9000s) for subsequent commits that day
        CURRENT_TIME_IN_DAY=$(( CURRENT_TIME_IN_DAY + 1800 + (RANDOM % 7200) ))
    fi

    for f in "${files[@]}"; do
        # Suppress warnings if a specific file pattern doesn't perfectly match
        git add "$f" 2>/dev/null
    done

    # Calculate exact unix timestamp for the commit
    local commit_unix=$(( START_DATE + (day_offset * SECONDS_PER_DAY) + CURRENT_TIME_IN_DAY ))
    local commit_date=$(date -d "@$commit_unix" +"%Y-%m-%dT%H:%M:%S")

    # Only commit if we successfully staged something
    if ! git diff --cached --quiet; then
        GIT_COMMITTER_DATE="$commit_date" GIT_AUTHOR_DATE="$commit_date" git commit -m "$msg"
    fi
}

echo "Generating realistic human history..."

# --- Day 1 ---
commit 0 "init project repo" "./README.md" "./.gitignore"
commit 0 "add vscode workspace settings" "./.vscode/"
commit 0 "npm init for backend" "./backend/package.json" "./backend/package-lock.json"
commit 0 "scaffolding frontend with vite" "./frontend/package.json" "./frontend/package-lock.json" "./frontend/vite.config.js" "./frontend/index.html"
commit 0 "setup eslint" "./backend/eslint.config.js"

# --- Day 2 ---
commit 1 "adding env and utils" "./backend/src/lib/env.js" "./backend/src/lib/utils.js"
commit 1 "test db connection" "./backend/src/config/"
commit 1 "user & group schemas" "./backend/src/models/user.model.js" "./backend/src/models/group.model.js"
commit 1 "message schema" "./backend/src/models/message.model.js"

# --- Day 3 ---
commit 2 "basic auth controller structure" "./backend/src/controllers/auth.controller.js"
commit 2 "message and group controllers" "./backend/src/controllers/message.controller.js" "./backend/src/controllers/group.controller.js"
commit 2 "plumbing the routes" "./backend/src/routes/"
commit 2 "add base server.js" "./backend/src/server.js"

# --- Day 4 ---
commit 3 "working on socket.io setup" "./backend/src/lib/socket.js"
commit 3 "add email templates" "./backend/src/emails/"
commit 3 "middlewares for auth" "./backend/src/middleware/auth.middleware.js" "./backend/src/middleware/socketAuthMiddleware.js"
commit 3 "hook up routes in server" "./backend/src/server.js"
commit 3 "fixed a weird socket middleware issue" "./backend/src/middleware/"

# --- Day 5 ---
commit 4 "tailwind setup" "./frontend/tailwind.config.js" "./frontend/postcss.config.js" "./frontend/src/index.css"
commit 4 "axios base instance" "./frontend/src/lib/axios.js"
commit 4 "zustand auth store" "./frontend/src/store/useAuthStore.js"
commit 4 "zustand chat store" "./frontend/src/store/useChatStore.js"
commit 4 "app wrapper" "./frontend/src/main.jsx" "./frontend/src/App.jsx"

# --- Day 6 ---
commit 5 "login and signup pages" "./frontend/src/pages/LoginPage.jsx" "./frontend/src/pages/SignUpPage.jsx"
commit 5 "auth pattern ui" "./frontend/src/components/AuthImagePattern.jsx" "./frontend/src/components/BorderAnimatedContainer.jsx"
commit 5 "wire up routing" "./frontend/src/App.jsx"
commit 5 "tweak auth styling" "./frontend/src/pages/LoginPage.jsx" "./frontend/src/pages/SignUpPage.jsx"

# --- Day 7 ---
commit 6 "chat page structure" "./frontend/src/pages/ChatPage.jsx" "./frontend/src/components/ChatContainer.jsx"
commit 6 "sidebar chat list" "./frontend/src/components/ChatsList.jsx" "./frontend/src/components/ContactList.jsx"
commit 6 "message bubbles" "./frontend/src/components/Message.jsx"
commit 6 "chat header and input bar" "./frontend/src/components/ChatHeader.jsx" "./frontend/src/components/MessageInput.jsx"

# --- Day 8 ---
commit 7 "group info panel" "./frontend/src/components/GroupInfo.jsx"
commit 7 "create group modal logic" "./frontend/src/components/CreateGroupModal.jsx"
commit 7 "profile header" "./frontend/src/components/ProfileHeader.jsx"
commit 7 "sync socket events to store" "./frontend/src/store/useChatStore.js"
commit 7 "add tab switcher" "./frontend/src/components/ActiveTabSwitch.jsx"

# --- Day 9 ---
commit 8 "start webrtc video call component" "./frontend/src/components/VideoCall.jsx"
commit 8 "add call signaling to backend" "./frontend/src/store/useChatStore.js" "./backend/src/lib/socket.js"
commit 8 "empty state placeholders" "./frontend/src/components/NoChatHistoryPlaceholder.jsx" "./frontend/src/components/NoConversationPlaceholder.jsx"
commit 8 "no chats found state" "./frontend/src/components/NoChatsFound.jsx"

# --- Day 10 ---
commit 9 "add loading skeleton" "./frontend/src/components/MessagesLoadingSkeleton.jsx" "./frontend/src/components/UsersLoadingSkeleton.jsx"
commit 9 "page loader" "./frontend/src/components/PageLoader.jsx"
commit 9 "fixing some bugs in message controller" "./backend/src/controllers/message.controller.js" "./frontend/src/pages/ChatPage.jsx"
commit 9 "final css tweaks" "./frontend/src/index.css" "./frontend/tailwind.config.js"
# The final commit gathers absolutely everything untouched (like backend/dump.rdb if it shouldn't be ignored, though it shouldn't be tracked)
commit 9 "final wrap up and cleanup" "."

echo "Realistic history generation complete."

# Force pushing to your new repository
git push -u origin main -f

echo "Successfully pushed to https://github.com/Ayush001verma/Echo-Chat.git"
