pipeline {
    agent { 
        label 'iunstable0_personal-website'
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                echo "Hello" > hi
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}