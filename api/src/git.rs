use git2::{Repository, Commit, Error, Oid, Signature, ObjectType};
use std::path::{Path};
use termion::color;

use std::fs::File;

/// Make sure that we can find the repo on startup
// TODO stdin option to clone from the remote repo if it can not open the local one
pub fn start_up() {
    match Repository::open("./articles") {
        Ok(_) => println!("{}Opened the article repo.{}", color::Fg(color::LightGreen), color::Fg(color::Reset)),
        Err(e) => panic!("failed to open: {}", e),
    };
}

/// Open up a repo
pub fn open() -> Result<Repository, Error> {
    return match Repository::open("./articles") {
        Ok(repo) => Ok(repo),
        Err(e) => Err(e)
    };
}

/// Display a commit
pub fn display_commit(commit: &Commit) {
    println!("{}Commit {}\nAuthor: {}\nDate: {}\n\n{}{}",
             color::Fg(color::LightCyan),
             commit.id(),
             commit.author(),
             commit.time().seconds(),
             commit.message().unwrap_or("No commit message"),
             color::Fg(color::Reset),
    )
}

/// Display a Commit with an Oid, for example if you want to display a
/// commit after you commit to repo
pub fn display_commit_by_oid(oid: Oid) -> Result<(), Error> {
    let repo = open()?;
    let commit = repo.find_commit(oid)?;
    Ok(display_commit(&commit))
}

/// Find the last commit of a repo
fn find_last_commit(repo: &Repository) -> Result<Commit, git2::Error> {
    let obj = repo.head()?.resolve()?.peel(ObjectType::Commit)?;
    obj.into_commit().map_err(|_| git2::Error::from_str("Couldn't find commit"))
}

/// Add and commit a file to the repo
pub fn add_and_commit(path: &Path, username: &str, message: &str, title: &str) -> Result<Oid, Error> {
    let repo = open()?;
    // Add
    let mut index = repo.index()?;
    index.add_path(path)?;
    index.write()?;
    //Commit
    let oid = index.write_tree()?;
    let user_signature = Signature::now(&username.to_lowercase(), &*format!("{}@technicalmc.xyz", &username))?;
    let commit_signature = Signature::now("tmc-wiki", "tmc-wiki@technicalmc.xyz")?;
    let parent_commit = find_last_commit(&repo)?;
    let tree = repo.find_tree(oid)?;
    repo.commit(
        Some("HEAD"),
        &user_signature,
        &commit_signature,
        &*format!("[{}]: {}", title, message),
        &tree,
        &[&parent_commit],
    )
}
#[allow(dead_code)]
fn find_last_commit_file(repo: &Repository, _file: File) -> Result<Commit, Error> {
    let obj = repo.head()?.resolve()?.peel(ObjectType::Commit)?;
    obj.into_commit().map_err(|_| git2::Error::from_str("Couldn't find commit"))
}


// fn blame(path: Path){
//     let repo = open()?;
//     // Blame options
//     let mut opts = BlameOptions::new();
//     opts.track_copies_same_commit_moves(true)
//         .track_copies_same_commit_copies(true)
//         .first_parent(true);
//     let blame = repo.blame_file(&path, Some(&mut opts))?;
//
//     println!("{}", blame.len());
// }
