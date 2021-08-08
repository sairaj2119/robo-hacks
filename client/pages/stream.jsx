import React, { useEffect, useState, useRef } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import { useAuth } from '../authContext'
import axios from 'axios'

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : 'http://localhost:5000'

console.log(backend_url)

const Dash = () => {
  const [rules, setRules] = useState(null)
  const tagRef = useRef(null)
  const ruleRef = useRef(null)
  const [count, setCount] = useState(0)
  const [stream, setStream] = useState(false)

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const { data } = await axios.get(`${backend_url}/t/rules`)
        setRules(data.data)
        if (!data.data && data.meta) {
          setRules([])
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchRules()
  }, [count])

  const handleAddNewRule = async (e) => {
    e.preventDefault()
    const payload = { tag: tagRef.current.value, value: ruleRef.current.value }
    console.log(payload)
    if (
      !payload.tag ||
      !payload.value ||
      payload.tag.trim() === '' ||
      payload.value.trim() === ''
    ) {
      return
    }
    try {
      console.log(1)
      await axios.post(`${backend_url}/t/rules`, payload)
      console.log(2)
      tagRef.current.value = ''
      ruleRef.current.value = ''
      setCount(count + 1)
    } catch (err) {}
  }

  const deleteAllRules = async () => {
    try {
      await axios.delete(`${backend_url}/t/rules`)
      setCount(count + 1)
    } catch (err) {}
  }

  const startStream = async () => {
    await axios.get(`${backend_url}/t/stream`)
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '2rem auto',
      }}
    >
      <h1>Current Rules</h1>

      {rules?.length > 0 ? (
        <Card>
          <Card.Body>
            {rules.map((rule) => (
              <Card.Text key={rule.id}>
                {rule.tag} {'==='} {rule.value}
              </Card.Text>
            ))}
          </Card.Body>
        </Card>
      ) : (
        <h6>No rules yet</h6>
      )}

      <Form className="mt-5" onSubmit={handleAddNewRule}>
        <Form.Group className="mb-3">
          <Form.Label>Tag</Form.Label>
          <Form.Control ref={tagRef} type="text" placeholder="Enter Tag" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Add a new rule </Form.Label>
          <Form.Control ref={ruleRef} type="text" placeholder="Enter Rule" />
          <Form.Text className="text-muted">rules shoudl follow twitter rule guidlines</Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      <div className="w-100 d-flex justify-content-between mt-5">
        {stream ? (
          <Button variant="warning" onClick={startStream}>
            Stop Stream
          </Button>
        ) : (
          <Button variant="success" onClick={startStream}>
            Start Stream
          </Button>
        )}
        <Button variant="danger" onClick={deleteAllRules}>
          Delete All Rules
        </Button>
      </div>
    </div>
  )
}

export default Dash
