import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionSection({ mockInterviewQues, activeQuestionIndex }) {


    const texttoSpeech = (text) => {
        if ('specchSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech)
        }
        else {
            alert('Sorry your browswer doesnt support speech')
        }
    }
    return mockInterviewQues && (
        <div className='p-5 border rounded-lg my-10'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {mockInterviewQues && mockInterviewQues.map((ques, index) => (
                    <h2 className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex == index && 'bg-primary text-white'}`}>
                        Question #{index + 1}
                    </h2>
                ))}
            </div>
            <h2 className='my-5 text-md md:text-lg'> {mockInterviewQues[activeQuestionIndex]?.question}</h2>
            <Volume2 onClick={() => texttoSpeech(mockInterviewQues[activeQuestionIndex]?.question)} />
            <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
                <h2 className='flex gap-2 items-center text-primary'>
                    <Lightbulb />
                    <strong>Note:</strong>
                </h2>
                <h2 className='text-sm text-primary my-2'></h2>
            </div>
        </div>

    )
}

export default QuestionSection