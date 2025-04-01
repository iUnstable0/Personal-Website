use tokio_cron_scheduler::{Job, JobScheduler, JobSchedulerError};

use crate::config::CONFIG;
use crate::modules::{cache, discord};

pub async fn init() -> Result<(), JobSchedulerError> {
    let mut sched = JobScheduler::new().await?;

    sched
        .add(Job::new_async("*/2 * * * * *", |uuid, mut l| {
            Box::pin(async move {
                let response = discord::get_info(false).await;

                match response {
                    Ok(data) => {
                        if data.changed {
                            println!("Detected changes, notifying clients");
                        }
                    }
                    Err(e) => error!("Error in cron job: {}", e),
                };
            })
        })?)
        .await?;

    sched.set_shutdown_handler(Box::new(|| {
        Box::pin(async move { println!("Shutdown done") })
    }));

    sched.start().await?;

    // tokio::time::sleep(Duration::from_secs(100)).await;
    Ok(())
}
