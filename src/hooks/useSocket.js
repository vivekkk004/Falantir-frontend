import { useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000'

let _socket = null

function getSocket() {
  if (!_socket) {
    _socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
    })
  }
  return _socket
}

export function useSocket() {
  const [connected, setConnected] = useState(false)
  const socket = useRef(getSocket())

  useEffect(() => {
    const s = socket.current
    if (!s.connected) s.connect()

    s.on('connect', () => setConnected(true))
    s.on('disconnect', () => setConnected(false))

    return () => {
      s.off('connect')
      s.off('disconnect')
    }
  }, [])

  const joinAgent = useCallback((agentId) => {
    socket.current.emit('join_agent', { agent_id: agentId })
  }, [])

  const leaveAgent = useCallback((agentId) => {
    socket.current.emit('leave_agent', { agent_id: agentId })
  }, [])

  const onAgentUpdate = useCallback((callback) => {
    socket.current.on('agent_update', callback)
    return () => socket.current.off('agent_update', callback)
  }, [])

  const onIncidentAlert = useCallback((callback) => {
    socket.current.on('incident_alert', callback)
    return () => socket.current.off('incident_alert', callback)
  }, [])

  const onAgentStatusChange = useCallback((callback) => {
    socket.current.on('agent_status_change', callback)
    return () => socket.current.off('agent_status_change', callback)
  }, [])

  return {
    socket: socket.current,
    connected,
    joinAgent,
    leaveAgent,
    onAgentUpdate,
    onIncidentAlert,
    onAgentStatusChange,
  }
}
