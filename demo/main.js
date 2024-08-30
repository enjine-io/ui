class Main extends App
{
    onStart()
    {
        // Create a fullscreen layout with objects vertically centered
        this.main = ui.addLayout("main", "Linear", "VCenter,FillXY")

        // Add a button to the main layout to show the actionsheet when click
        this.btn = ui.addButton(this.main, "Show Bottom Sheet", "Primary")
        this.btn.setOnTouch( this.btn_onTouch )

        this.bts = ui.addBottomSheet( "My title" );

        // Create a button and add it to the bottomsheet layout.
        var btn = ui.addButton(this.bts.layout, "Button", "Secondary");
        btn.margins = [0, "1rem", 0, "1rem"];
    }

    btn_onTouch()
    {
        // show the bottomsheet
        this.bts.show();
    }
}