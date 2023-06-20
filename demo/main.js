class Main extends App
   {
       onStart()
       {
           // Set theme colors.
           ui.setThemeColor(  ui.theme.primary, "#999999" )

           // Create a full screen layout.
           this.main = ui.addLayout( "main", "Linear", "VCenter,FillXY" )

           this.apb = ui.addAppBar( this.main, "My App", "Menu,Primary" )
           this.apb.setOnMenu( this.showDrawer )
       
           // Add an icon buttons to the appbar
           this.btn1 = ui.addButton( this.apb.layout, "person", "icon" )
           this.btn2 = ui.addButton( this.apb.layout, "delete", "icon" )
           this.btn3 = ui.addButton( this.apb.layout, "more_vert", "icon" )
       
           // Adds a drawer layout
           this.drawLay = ui.addLayout(null, "Linear", "Top")

           // Adds a drawer to the app and pass the drawer layout
           this.drawer = ui.addDrawer(this.drawLay, "left")

           // Adds a list to the drawer layout
           let lst = [
               ["folder", "Folders"],
               ["music_note", "Audios"],
               ["photo", "Photos"]
           ]
           this.lstMenu = ui.addList(this.drawLay, lst, "Icon", 1 )
           this.lstMenu.label = "Main navigation"

           // Adds text and icon to main layout.
           this.text = ui.addText( this.main, "Hello World!", "Center,H4,Secondary", 1 )
           this.text.margins = 0.02

           // Adds an icon with a margin.
           this.icon = ui.addText( this.main, "sentiment_satisfied", "Icon" )
           this.icon.textSize = "2.9em"
           this.icon.textColor = "#ff88ff"

           // Adds and FAB button.
           this.fab = ui.addFAB( this.main, "add", "Primary,Extended,Left", "New message" )
       }

       showDrawer() {
           this.drawer.show()
       }
   }

