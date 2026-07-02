import { isIP } from 'net'
import Result from 'src/Common/Application/Result'
import ValueObject from 'src/Common/Domain/ValueObject'
import Notification from 'src/Common/Application/Notification'

export default class IP extends ValueObject<string> {
	public static INVALID_IP_ADDRESS = 'INVALID_IP_ADDRESS'

	public static createFromInput(ip: string): Result<IP, Notification> {
		if (!isIP(ip)) {
			const notification = new Notification()
			notification.addError(IP.INVALID_IP_ADDRESS)
			return { failure: notification }
		}

		return { ok: new IP(ip) }
	}
	public static createFromValid(ip: string): IP {
		return new IP(ip)
	}
}
