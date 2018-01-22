import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from './../../BaseComponents/Loader';
import Question from './../../BaseComponents/Question';
import Header from './../../BaseComponents/Header';
import { ReadFromFirebase } from './../../../Firebase';
import { uniqNumber } from './../../../Helpers';
import './Quiz.css';

class Quiz extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            logoUrl: "",
            noOfques: "",
            totalTime: "",
            companyName: ""

        }
    }

    _getRandomQuestions(arr, questions) {
        let questionsArray = [];
        for (let index = 0; index < arr.length; index++) {
            questionsArray.push(questions[arr[index]]);
        }
        return questionsArray;
    }

    componentDidMount() {
        let quizId = this.props.match.params.quizID
        let dbRef = `settings/${quizId}`
        ReadFromFirebase(dbRef).then((snapshot) => {
            let res = snapshot.val();
            let uniqueArray = uniqNumber(
                {
                    min: 0,
                    max: 9,
                    count: Number(res.noOfques),
                    sort: 'asc'
                }
            )
            console.log(uniqueArray)
            fetch(res.quesUrl)
                .then((res) => {
                    return res.json()
                })
                .then((questions) => {
                    this.setState({
                        questions: this._getRandomQuestions(uniqueArray, questions),
                        logoUrl: res.logoUrl,
                        noOfques: Number(res.noOfques),
                        totalTime: Number(res.totalTime),
                        companyName: res.companyName
                    })
                })
        })
    }

    renderLoader() {
        return <Loader />
    }

    renderQuestions() {
        return <Question questions={this.state.questions} />
    }

    render() {
        return (
            <div className="Quiz">
                {this.state.questions.length > 0 ?
                    <div>
                        <Header title={this.state.companyName} />
                        <main className="container">
                            {this.renderQuestions()}
                        </main>
                    </div>
                    : this.renderLoader()}
            </div>
        );
    }
}

Quiz.propTypes = {

};

export default Quiz;