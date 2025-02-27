class Main extends App
{
    onStart()
    {
        this.main = ui.addLayout("main", "Linear", "FillXY")

        // Adds an appbar with menu options to show the drawer when click
        this.apb = ui.addAppBar(this.main, "My app", "", 1)

        // Adds a text control
        this.txt = ui.addText(this.main, "Hello world!")
        this.txt.setMargins(0, 5, 0, 2, "rem")

        // Adds a button control
        this.btn = ui.addButton(this.main, "Click me", "Primary")
        this.btn.setOnTouch( this.btn_OnTouch )
    }

    btn_OnTouch()
    {
        ui.showPopup("You clicked me!")
    }
}