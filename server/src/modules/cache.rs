use serde::{Serialize, de::DeserializeOwned};
use serde_json;
use std::{
    fs,
    io::{Error, ErrorKind, Result},
};

pub fn init() {
    if !fs::exists("./data").unwrap() {
        fs::create_dir("./data").unwrap();
    }
}

pub fn exists(file: &str) -> bool {
    fs::exists(format!("./data/{file}")).unwrap()
}

pub fn read_raw(file: &str) -> Result<String> {
    fs::read_to_string(format!("./data/{file}"))
}

pub fn write_raw(file: &str, test: &str) -> Result<()> {
    fs::write(format!("./data/{file}"), test)
}

pub fn read_json<T: DeserializeOwned>(file: &str) -> Result<T> {
    let data = fs::read_to_string(format!("./data/{file}"))?;

    serde_json::from_str(&data).map_err(|e| Error::new(ErrorKind::Other, e))
}

pub fn write_json<T: Serialize + ?Sized>(file: &str, data: &T) -> Result<()> {
    let parsed = serde_json::to_string_pretty(data)?;

    fs::write(format!("./data/{file}"), parsed)
}
