"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { chatSession } from '@/utils/geminiAIModel';
import { useUser } from '@clerk/nextjs';
import { Mic } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from 'react-webcam'
import { toast } from 'sonner';
import { userAnswerSchema } from '@/utils/schema'

function RecordAnswerSection({ mockInterviewQues, activeQuestionIndex, interviewData }) {

    const [userAnswer, setUserAnswer] = useState()
    const { user } = useUser();
    const [loading, setLoading] = useState(false)
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        results.map((result) => (
            setUserAnswer(prevAns => prevAns + result?.transcript || '')
        ))
    }, [results])

    useEffect(() => {
        if (!isRecording && userAnswer && userAnswer.length > 10) {
            updateUserAnswer()
        }
    }, [userAnswer])


    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText()
            if (userAnswer?.length < 10) {
                setLoading(false)

                toast('Error while saving your answer, please record again ')
                return;
            }
        }
        else {
            startSpeechToText()
        }
    }
    const updateUserAnswer = async () => {
        console.log(userAnswer)
        setLoading(true)
        const feedbackPrompt = 'Question:' + mockInterviewQues[activeQuestionIndex]?.question +
            ", User Answer:" + userAnswer + ", Depends on question and user answer for given interview question" +
            ", please give us rating for answer and fewedback as area of improvment if any" +
            "in just 3-5 lines to improve it in JSON format with rating field and feedback field"


        const result = await chatSession.sendMessage(feedbackPrompt);
        const MockJSONResp = (result.response.text()).replace('```json', '').replace('```', '')
        const jsonFeedbackResp = JSON.parse(MockJSONResp);
        const resp = await db.insert(userAnswerSchema).values({
            mockIdRef: interviewData?.mockId,
            question: mockInterviewQues[activeQuestionIndex]?.question,
            correctAns: mockInterviewQues[activeQuestionIndex]?.answer,
            userAns: userAnswer,
            feedback: jsonFeedbackResp?.feedback,
            rating: jsonFeedbackResp?.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy')
        })

        if (resp) {
            toast('User Answer recorded Sucessfully')
        }
        setUserAnswer('')
        setResults([])
        setLoading(false)
    }
    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
                <Image src={'/webcam.png'} width={200} height={200} className='absolute' />
                <Webcam
                    mirrored={true}
                    style={{
                        width: '100%',
                        height: 300,
                        zindex: 10
                    }}
                />
            </div>
            <Button disabled={loading} variant='outline' className='my-10' onClick={StartStopRecording} >
                {isRecording ? <h2 className='flex gap-2 text-red-600 animate-pulse items-center'><Mic />Stop Recording</h2>
                    :
                    <h2 className='text-primary gap-2 items-center'>Record Answer</h2>}</Button>
            {/* <Button onClick={() => console.log(userAnswer)}> Show User Answer</Button> */}








        </div>
    )
}

export default RecordAnswerSection