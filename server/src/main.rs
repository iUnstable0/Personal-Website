use tracing_subscriber::{EnvFilter, FmtSubscriber, util::SubscriberInitExt};

use async_graphql::{EmptySubscription, Schema, http::GraphiQLSource};

use async_graphql_axum::GraphQL;
use axum::{
    Router,
    response::{Html, IntoResponse},
    routing::get,
};

use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;

// use graphql::xx also works, but I prefer
// being explicit if a package is local or external
use crate::config::CONFIG;
use crate::graphql::{mutation::Mutation, query::Query};
use crate::modules::cache;

#[macro_use]
pub extern crate tracing;

mod config;
mod cron;
mod errors;
mod graphql;
mod models;
mod modules;

type AppSchema = Schema<Query, Mutation, EmptySubscription>;

async fn graphiql() -> impl IntoResponse {
    Html(GraphiQLSource::build().endpoint("/").finish())
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    dotenvy::dotenv().ok();

    FmtSubscriber::builder()
        .pretty()
        .with_env_filter(
            EnvFilter::try_from_default_env().unwrap_or(
                format!("{pkg}=info", pkg = env!("CARGO_PKG_NAME").replace("-", "_"))
                    .parse()
                    .unwrap(),
            ),
        )
        .finish()
        .init();

    info!("Environment: {:?}", CONFIG.environment);

    cache::init();

    cron::init()
        .await
        .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e))?;

    let listener = TcpListener::bind(format!("0.0.0.0:{}", CONFIG.port)).await?;
    let addr = listener.local_addr()?;

    let schema = Schema::build(Query, Mutation, EmptySubscription).finish();

    info!("Starting server at http://{}", addr);
    info!("Playground running at http://{addr}/gqli");

    let router = Router::new()
        .route("/", get(graphiql).post_service(GraphQL::new(schema)))
        // .route("/", get(|| async { Html("<h1>Hello bobux</h1>") }))
        // .route("/gql", get(graphql_playground).post_service(graphql_handler))
        // .route("/gqli", get(playground))
        .layer(CorsLayer::permissive());

    axum::serve(listener, router).await
}
