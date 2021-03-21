# Locales

Here you can find all available languages for the interface. These are structured as follows

```
{
  "views": {
    "dashboard": {
      "title": "Dashboard",
      "welcome": "Welcome",
      "hello": "Hello",
      "undertitle": "Below you can see your favourite streams",
      "offline": "offline!"
    },
    "cameras": {
      "title": "Cameras",
      "notification_title": "Latest Notification",
      "notifications_title": "Latest Notifications",
      "notification_info": "Movement detected on",
      "notification_nodata": "No Data",
      "offline": "offline!"
    },
    "camera": {
      "notification_title": "Latest Notification",
      "notifications_title": "Latest Notifications",
      "notification_info": "Movement detected on",
      "notification_nodata": "No Data",
      "previous_camera": "Previous Camera",
      "next_camera": "Next Camera",
      "offline": "offline!"
    },
    "recordings": {
      "title": "Recordings",
      "room": "Room",
      "info": "This file was recorded on",
      "btn_removeall": "Remove All",
      "no_recordings": "No Recordings",
      "download": "Download",
      "error": "An error occured!",
      "rec_removed": "Recording @ removed!",
      "all_removed": "All Recordings removed!"
    },
    "notifications": {
      "title": "Notifications",
      "movement": "Movement",
      "labels": "Labels",
      "btn_removeall": "Remove All",
      "no_notifications": "No Notifications",
      "img_notification": "Notification Image",
      "error": "An error occured!",
      "not_removed": "Notification @ removed!",
      "all_removed": "All Notifications removed!"
    },
    "settings": {
      "title": "Settings",
      "apply": "Apply",
      "cancel": "Cancel",
      "reset": "Reset",
      "reset_confirm": "Confirm Reset",
      "reset_info": "After clicking on Reset, all saved data will be irrevocably deleted! Are you sure?",
      "reset_btn_reset": "Reset",
      "reset_btn_close": "Close",
      "select_never": "Never",
      "subnavigation": {
        "profile": "Profile",
        "general": "General",
        "dashboard": "Dashboard",
        "cameras": "Cameras",
        "recordings": "Recordings",
        "notifications": "Notifications",
        "camviews": "CamViews",
        "webhook": "Webhook"
      },
      "popup": {
        "btn_close": "Close"
      },
      "views": {
        "profile": {
          "account_title": "Account",
          "account_undertitle": "General Information",
          "account_name": "Name",
          "account_signout": "Sign out after (h)",
          "password_title": "Password",
          "password_undertitle": "Manage your password",
          "password_old": "Old Password",
          "password_new": "New Password",
          "password_confirm": "Confirm new Password",
          "user_title": "User",
          "user_undertitle": "Registred User Overview",
          "user_new": "New User",
          "user_new_name": "Name",
          "user_new_username": "Username",
          "user_new_password": "Password",
          "user_new_role": "Role",
          "user_new_add": "Add new User",
          "user_role_admin": "Administrator",
          "user_role_user": "User",
          "invalid_username": "Invalid Username!"                    
        },
        "general": {
          "title": "General",
          "athome": "At Home",
          "athome_info": "If enabled, incoming notifications and recordings will be disabled for NOT excluded cameras!",
          "exclude": "Exclude",
          "exclude_info": "Excluded cameras are not affected from 'At Home'. These cameras will continue to send notifications and take recordings.",
          "themes_title": "Themes",
          "themes_darkmode": "Darkmode",
          "themes_themes": "Themes",
          "rooms_title": "Rooms",
          "rooms_name": "Room Name",
          "rooms_name_standard": "Standard",
          "rooms_name_error_title": "Error",
          "rooms_name_error_text": "The entered room name must not be empty or already exist!",
          "nothing_selected": "Nothing selected"
        },
        "dashboard": {
          "title": "Dashboard",
          "title_cameras": "Cameras",
          "timer": "Image refresh timer (s)",
          "timer_info": "Timer in seconds to generate a new Snapshot from camera (if livestream disabled)",
          "favourite": "Favourite",
          "favourite_info": "If enabled, this camera will be displayed in the dashboard.",
          "livestream": "Livestream",
          "livestream_info": "If enabled, this camera will show a Livestream. If disabled, it will show Snapshots generated after specific timer (see Image refresh timer)."
        },
        "cameras": {
          "title": "Cameras",
          "info": "Camera Info",
          "room": "Select Room",
          "video": "Video Resolution",
          "audio": "Enable Audio"
        },
        "recordings": {
          "title": "Recordings",
          "active": "Active",
          "active_info": "If enabled, recording will be activated for all cameras. Recording will be triggered from motion.",
          "type": "Recording type",
          "type_info": "Choose between Snapshot and Video. Snapshot will change recording to JPEG files and Video will change recording to MP4 files.",
          "type_snapshot": "Snapshot",
          "type_video": "Video",
          "timer": "Recording timer (s)",
          "timer_info": "Timer in seconds for video recording (if recording type is video).",
          "store": "Store Path",
          "store_info": "Path to save recorded files.",
          "remove": "Remove after (d)",
          "remove_info": "Timer in days for automatically remove recordede files from disk."
        },
        "notifications": {
          "title": "Notifications",
          "remove": "Remove after (h)",
          "remove_info": "Timer in hours for automatically remove notifications from cache and interface.",
          "remove_banner": "Remove Banner after (s)",
          "remove_banner_info": "Timer in seconds for slide up incoming notifiation banner."
        },
        "telegram": {
          "title": "Telegram",
          "active": "Active",
          "active_info": "Enbales telegram notification for motion alerts.",
          "token": "Token",
          "token_info": "The token given by @BotFather when creating the Telegram bot.",
          "chatid": "Chat ID",
          "chatid_info": "The chat ID given by the bot after sending '/start' to it.",
          "motion_text": "Motion Text",
          "motion_text_info": "Customized text in telegram for motion alerts. (@ will be replaced with camera name).",
          "type_snapshot": "Snapshot",
          "type_video": "Video",
          "type_text": "Text",
          "type_info": "You can choose between several options for telegram notification. Video and Snapshot will only work if recording is activated!"
        },
        "camviews": {
          "title": "CamViews",
          "title_cameras": "Cameras",
          "timer": "Image refresh timer (s)",
          "timer_info": "Timer in seconds to generate a new Snapshot from camera (if livestream disabled)",
          "favourite": "Favourite",
          "favourite_info": "If enabled, this camera will be displayed in the dashboard.",
          "livestream": "Livestream",
          "livestream_info": "If enabled, this camera will show a Livestream. If disabled, it will show Snapshots generated after specific timer (see Image refresh timer)."
        },
        "webhook": {
          "title": "Webhook",
          "title_endpoint": "Endpoint",
          "title_endpoints": "Endpoints",
          "active": "Active",
          "active_info": "If enabled, the motion handler will additionally trigger given webhook endpoint on motion detection.",
          "status": "Status",
          "status_online": "Online",
          "status_offline": "Offline",
          "on_info": "Trigger Webhook Endpoint on motion detection.",
          "athome_endpoint": "At Home",
          "athome_on": "On",
          "athome_off": "Off",
          "athome_trigger": "Trigger",
          "exclude_endpoint": "Exclude",
          "exclude_add": "Add",
          "exclude_del": "Remove",
          "exclude_clear": "Clear"
        }
      }
    },
    "camviews": {
      "title": "CamViews",
      "btn_fullscreen": "Fullscreen",
      "btn_close": "Close",
      "btn_logout": "Logout",
      "btn_back": "Back",
      "btn_positions": "Save Positions",
      "btn_positions_saved": "Saved!",
      "lastnotification": "Last Movement",
      "nodata": "No Data",
      "offline": "offline!"
    },
    "login": {
      "title": "Login",
      "welcome_desktop": "Welcome to",
      "welcome_mobile": "Welcome",
      "undertitle_desktop": "A Homebridge user interface to control",
      "undertitle2_desktop": "your cameras",
      "undertitle_mobile": "preparing your streams",
      "username": "Username",
      "password": "Password",
      "forgotpw": "Forgot Password?",
      "forgotpw_info": "If you forgot your password, you can reset the master credentials by setting 'reset' to true in your config.",
      "signin": "Sign in",
      "loading": "Loading",
      "go": "Go",
      "anonym": "Anonym",
      "guest": "Guest",
      "incorrect_cr": "Incorrect Username/Password!"
    },
    "change": {
      "welcome": "Welcome",
      "undertitle": "Please change your credentials to continue",
      "username": "Username",
      "username_new": "New Username",
      "password": "Password",
      "password_new": "New Password",
      "save_signin": "Save & Sign in",
      "loading": "Loading",
      "same_username": "Username and New Username must not be the same!",
      "same_pw": "Password and New Password must not be the same!",
      "wrong_pw": "Wrong password!",
      "empty": "Please fill all empty fields!",
      "incorrect_cr": "Incorrect Username/Password!"
    },
    "logout": {
      "title": "See you soon",
      "undertitle": "logout is beeing processed"
    },
    "error": {
      "goback": "Go Back",
      "restricted": "Restricted!",
      "stop": "Stop!",
      "unauthorized": "Unauthorized!",
      "login": "Login",
      "dashboard": "Dashboard",
      "ooops": "Ooops!",
      "notfound": "Not found!"
    }
  },
  "navigation": {
    "dashboard": "Dashboard",
    "cameras": "Cameras",
    "recordings": "Recordings",
    "notifications": "Notifications",
    "settings": "Settings",
    "camviews": "CamViews",
    "logout": "Logout"
  },
  "breadcrumb": {
    "all": "All",
    "allnotifications": "All Notifications",
    "allrecordings": "All Recordings",
    "allcameras": "All Cameras",
    "filter": "Filter",
    "filter_standard": "Standard",
    "cameras": "Cameras",
    "rooms": "Rooms",
    "type": "Type",
    "selectDate": "Select date",
    "status": "Status",
    "online": "Online",
    "offline": "Offline",
    "snapshot": "Snapshot",
    "video": "Video"
  },
  "datepicker":{
    "applyLabel": "Apply",
    "cancelLabel": "Cancel",
    "fromLabel": "From",
    "toLabel": "To",
    "customRangeLabel": "Custom",
    "weekLabel": "W",
    "monday_code": "Mo",
    "tuesday_code": "Tu",
    "wednesday_code": "We",
    "thursday_code": "Th",
    "friday_code": "Fr",
    "saturday_code": "Sa",
    "sunday_code": "Su",
    "january": "January",
    "february": "February",
    "march": "March",
    "april": "April",
    "may": "May",
    "june": "June",
    "july": "July",
    "august": "August",
    "september": "September",
    "october": "October",
    "november": "November",
    "december": "December",
    "today": "Today",
    "yesterday": "Yesterday",
    "last7days": "Last 7 Days",
    "last30days": "Last 30 Days",
    "thismonth": "This Month",
    "lastmonth": "Last Month"
  },
  "banner": {
    "title": "Notifications",
    "camera_title": "Camera",
    "motion_info": "New motion detected",
    "doorbell_info": "Doorbell triggered"
  },
  "toast": {
    "not_info": "You have @ unread notification",
    "not_info_x": "You have @ unread notifications"
  }
}
```
