use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex, MutexGuard};

use git2::{Commit, Error, ObjectType, Oid, Repository, Signature};
use termion::color;

pub fn git_repo_path() -> Result<PathBuf, ()> {
    let path = dirs::home_dir();
    if let Some(home) = path {
        let path= home.join(".wiki/articles");
        Ok(path)
    } else {
        Err(())
    }
}

/// Make sure that we can find the repo on startup
pub fn start_up() -> Arc<Mutex<Repository>> {
    match git_repo_path() {
        Ok(path) => {
            match Repository::open(&path) {
                Ok(repo) => {
                    println!("{}Found the article repo.{}", color::Fg(color::LightGreen), color::Fg(color::Reset));
                    return Arc::new(Mutex::new(repo));
                }
                Err(_) => {
                    match Repository::clone("https://github.com/Technicalmc-xyz/articles", &path) {
                        Ok(repo) => {
                            println!("{}Cloned the article repo into {:?}{}", color::Fg(color::LightGreen), &path, color::Fg(color::Reset));
                            return Arc::new(Mutex::new(repo));
                        }
                        Err(e) => panic!("failed to clone: {}", e),
                    };
                }
            };
        }
        Err(_) => panic!("We could not find your home dir")
    }
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
pub fn display_commit_by_oid(repo: Arc<Mutex<Repository>>, oid: Oid) -> Result<(), Error> {
    let repo = repo.lock().unwrap();
    let commit = repo.find_commit(oid).unwrap();
    Ok(display_commit(&commit))
}

/// Find the last commit of a repo
fn find_last_commit<'a>(repo: &'a MutexGuard<Repository>) -> Result<Commit<'a>, git2::Error> {
    let obj = repo.head()?.resolve()?.peel(ObjectType::Commit)?;
    obj.into_commit().map_err(|_| git2::Error::from_str("Couldn't find commit"))
}

/// Add and commit a file to the repo
pub fn add_and_commit(repo: Arc<Mutex<Repository>>, path: &Path, username: &str, message: &str, title: &str) -> Result<Oid, Error> {
    // Add
    let repo = repo.lock().expect("COULD NOT UNLOCK MUTEX");
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
