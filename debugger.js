class Debugger {
    layers = {
        Unknown: new Category("unknown", Color.colors.White),
        Bot: new Category("totoboto4", Color.colors.Cyan),
        Client: new Category("client", Color.colors.Blue),
        Command: new Category("command", Color.colors.LightCyan)
    }
    types = {
        None: new Category("none", Color.colors.White),
        Debug: new Category("debug", Color.colors.Green),
        Warning: new Category("warning", Color.colors.Yellow),
        Error: new Category("error", Color.colors.Red)
    }

    cosntructor () {}

    /**
     * 
     * @param {Category} layer 
     * @param {Category} type 
     * @param {String} description 
     * @param {Array[String]} content 
     */
    debug(layer, type, description, content = []) {
        const time = new Category(new Date(Date.now()).toLocaleTimeString(), Color.colors.LightCyan)
        let log = time.getString() + " " +
        (layer != null ? layer.getString() : layer.Unknown.getString()) + " " +
        (type != null ? type.getString() : this.types.None.getString()) + " " +
        description
        content.forEach(value => log += `\n    ${value}`)
        console.log(log)
    }
}

class Category {
    text
    color

    constructor(text, color) {
        this.text = text
        this.color = color
    }

    /**
     * 
     * @returns String
     */
    getString() {
        return `${this.color.getColorString()}[${this.text}]${Color.colors.White.getColorString()}`
    }
}

class Color {
    static colors = {
        White: new Color("0"),
        Cyan: new Color("36"),
        Blue: new Color("34"),
        Green: new Color("32"),
        Yellow: new Color("33"),
        Red: new Color("31"),
        LightCyan: new Color("96")
    }

    constructor(color) {
        this.color = color
    }

    getColorString() {
        return `\x1b[${this.color}m`
    }
}

module.exports = new Debugger()