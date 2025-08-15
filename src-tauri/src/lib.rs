// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_api_key() -> Result<String, String> {
    std::env::var("OPENAI_API_KEY").map_err(|_| "api_key.not_found".to_string())
}

// --- Virtual Mouse Minimal Implementation ---


// --- Virtual Mouse Configuration Constants ---
use once_cell::sync::Lazy;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;

/// Absolute path to the Python interpreter in the Poetry virtual environment for the virtual mouse.
/// Update this if the venv is recreated or the path changes.
const VIRTUAL_MOUSE_PYTHON_PATH: &str = "/home/guuri/.cache/pypoetry/virtualenvs/virtual-mouse-ZJ-fpp_5-py3.10/bin/python";

/// Relative path to the main Python script for the virtual mouse, from the working directory.
const VIRTUAL_MOUSE_SCRIPT_PATH: &str = "src/main.py";

/// Absolute path to the working directory where the Python script should be launched.
/// This should be the root of the virtual-mouse Python project.
const VIRTUAL_MOUSE_WORKING_DIR: &str = "/home/guuri/dev/mamba/src-python/virtual-mouse";

/// Whether to suppress all output from the Python process (recommended for production).
const VIRTUAL_MOUSE_SUPPRESS_OUTPUT: bool = true;

// --- End Virtual Mouse Configuration ---

/// Tracks whether the virtual mouse is currently active.
static VIRTUAL_MOUSE_ACTIVE: Lazy<Mutex<bool>> = Lazy::new(|| Mutex::new(false));
/// Holds the handle to the running Python process, if active.
static VIRTUAL_MOUSE_PROCESS: Lazy<Mutex<Option<Child>>> = Lazy::new(|| Mutex::new(None));


/// Activates the virtual mouse by launching the Python process for hand tracking and mouse control.
///
/// This function uses the configuration constants above to determine the interpreter, script, and working directory.
/// If the process is already active, it does nothing.
#[tauri::command]
fn activate_virtual_mouse() -> Result<(), String> {
    let mut active = VIRTUAL_MOUSE_ACTIVE.lock().unwrap();
    let mut process_guard = VIRTUAL_MOUSE_PROCESS.lock().unwrap();
    if *active {
        return Ok(()); // Already active
    }

    let mut cmd = Command::new(VIRTUAL_MOUSE_PYTHON_PATH);
    cmd.arg(VIRTUAL_MOUSE_SCRIPT_PATH)
        .current_dir(VIRTUAL_MOUSE_WORKING_DIR);

    if VIRTUAL_MOUSE_SUPPRESS_OUTPUT {
        cmd.stdout(Stdio::null()).stderr(Stdio::null());
    }

    let child = cmd.spawn()
        .map_err(|e| format!("Failed to start virtual mouse python process: {}", e))?;
    *process_guard = Some(child);
    *active = true;
    println!("[virtual_mouse] activated and python process started");
    Ok(())
}


/// Deactivates the virtual mouse by killing the Python process, if running.
///
/// This function is idempotent and safe to call even if the process is not running.
#[tauri::command]
fn deactivate_virtual_mouse() -> Result<(), String> {
    let mut active = VIRTUAL_MOUSE_ACTIVE.lock().unwrap();
    let mut process_guard = VIRTUAL_MOUSE_PROCESS.lock().unwrap();
    if !*active {
        return Ok(()); // Already inactive
    }
    // Kill the python process if running
    if let Some(child) = process_guard.as_mut() {
        match child.kill() {
            Ok(_) => println!("[virtual_mouse] python process killed"),
            Err(e) => println!("[virtual_mouse] failed to kill python process: {}", e),
        }
        // Wait for process to exit
        let _ = child.wait();
    }
    *process_guard = None;
    *active = false;
    println!("[virtual_mouse] deactivated");
    Ok(())
}


/// Returns whether the virtual mouse is currently active (Python process running).
#[tauri::command]
fn is_virtual_mouse_active() -> Result<bool, String> {
    let active = VIRTUAL_MOUSE_ACTIVE.lock().unwrap();
    Ok(*active)
}

// --- End Virtual Mouse ---

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let port: u16 = 9527;

    tauri::Builder::default()
        .plugin(tauri_plugin_localhost::Builder::new(port).build())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_api_key,
            activate_virtual_mouse,
            deactivate_virtual_mouse,
            is_virtual_mouse_active,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
