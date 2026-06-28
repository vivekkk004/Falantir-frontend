import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useSocket } from '../../hooks/useSocket'
import { addNotification } from '../../app/features/notificationsSlice'
import { playAlarm } from '../../utils/sound'

/**
 * App-wide listener for `incident_alert` socket events. Mounted in the
 * authenticated shell (PrivateRoute) so theft alerts are captured on every
 * page — not just the Dashboard — and made durable in the notifications
 * store. Renders nothing.
 */
const AlertsListener = () => {
  const dispatch = useDispatch()
  const { onIncidentAlert } = useSocket()
  const agents = useSelector((state) => state.agents.list)

  useEffect(() => {
    const unsub = onIncidentAlert((data) => {
      const agent = agents.find((a) => a.id === data.agent_id)
      const isCritical = data.threat_label === 'critical'

      dispatch(
        addNotification({
          id: `${data.agent_id}-${data.timestamp || Date.now()}`,
          agent_id: data.agent_id,
          agent_name: agent?.name || data.agent_id,
          threat_label: data.threat_label,
          confidence: data.confidence,
          description: data.description,
          reasoning: data.reasoning,
          timestamp: data.timestamp || new Date().toISOString(),
          read: false,
        }),
      )

      toast.error(
        `${isCritical ? 'CRITICAL' : 'ALERT'}: ${data.description || 'Threat detected'}`,
        { duration: 6000 },
      )

      if (isCritical) playAlarm()
    })

    return unsub
  }, [onIncidentAlert, dispatch, agents])

  return null
}

export default AlertsListener
