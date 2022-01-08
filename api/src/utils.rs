use termion::color;

pub fn print_error(msg: String) {
    println!("{}{}{}", color::Fg(color::Red), msg, color::Fg(color::Reset))
}

pub fn print_success(msg: String) {
    println!("{}{}{}", color::Fg(color::Green), msg, color::Fg(color::Reset))
}
