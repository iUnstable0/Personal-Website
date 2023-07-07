pipeline {
    agent { 
        label 'iunstable0_personal-website'
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'echo "hi" > test.txt'
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