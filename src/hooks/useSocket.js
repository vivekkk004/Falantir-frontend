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

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    s.on('connect', onConnect)
    s.on('disconnect', onDisconnect)
    setConnected(s.connected)

    // Remove only OUR handlers — the socket is a shared singleton with
    // multiple consumers (Navbar, Dashboard, AlertsListener), so an
    // argument-less off() would tear down their listeners too.
    return () => {
      s.off('connect', onConnect)
      s.off('disconnect', onDisconnect)
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
