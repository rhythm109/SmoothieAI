import { IKImage } from 'imagekitio-react';
import Upload from '../upload/Upload';
import './newPrompt.css';
import { useEffect, useRef, useState } from 'react';
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const NewPrompt = ({ data }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {}
    });

    const [chat, setChat] = useState(null);

    // Ensure history is only updated when data changes
    const history = data?.history?.map(({ role, parts }) => ({
        role,
        parts: [{ text: parts[0]?.text }] // Ensure parts[0] exists and has text
    })) || [];

    // Initialize chat model once data is available and history is not empty
    useEffect(() => {
        if (data && history.length > 0) {
            const newChat = model.startChat({
                history: history, // Pass history directly
                generationConfig: {
                    // maxOutputTokens: 1000,
                },
            });
            setChat(newChat);
        }
    }, []); // Dependency array includes data and history

    const endRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    }, [question, answer, img.dbData]); // Dependencies related to scrolling

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => {
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: question.length ? question : undefined,
                    answer,
                    img: img.dbData?.filePath || undefined,
                }),
            }).then(res => res.json());
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chat", data._id] }).then(() => {
                formRef.current.reset();
                setQuestion("");
                setAnswer("");
                setImg({
                    isLoading: false,
                    error: "",
                    dbData: {},
                    aiData: {}
                });
            });
        },
        onError: (err) => {
            console.log(err);
        }
    });

    const add = async (text, isInitial) => {
        if (!chat) return; // Ensure chat is initialized
        if (!isInitial) setQuestion(text);
        try {
            const result = await chat.sendMessageStream(Object.entries(img.aiData).length ? [img.aiData, text] : [text]);

            let accumulatedText = "";
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                accumulatedText += chunkText;
                setAnswer(accumulatedText);
            }

            mutation.mutate();
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const text = e.target.text.value;
        if (!text) return;

        add(text, false);
    };

    const hasRun = useRef(false);
    useEffect(() => {
        if (!hasRun.current && data?.history?.length === 1) {
            add(data.history[0].parts[0].text, true);
            hasRun.current = true; // Ensure this runs only once
        }
    }, [data]); // Only depend on data for this effect

    if (!data) {
        return <div>Loading...</div>; // Show a loading message or spinner
    }

    return (
        <>
            {img.isLoading && <div className='loading'>Loading...</div>}
            {img.dbData?.filePath && (
                <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={img.dbData?.filePath}
                    width="380"
                    transformation={[{ width: 380 }]}
                />
            )}

            {question && <div className='message user'>{question}</div>}
            {question && <div className='message'>
                <Markdown>{answer}</Markdown>
            </div>}
            <div className="endChat" ref={endRef}></div>
            <form className='newForm' onSubmit={handleSubmit} ref={formRef}>
                <Upload setImg={setImg} />
                <input id="file" type="file" multiple={false} hidden />
                <input type="text" name="text" placeholder='Ask Anything...' />
                <button>
                    <img src="/arrow.png" alt="" />
                </button>
            </form>
        </>
    );
};

export default NewPrompt;
