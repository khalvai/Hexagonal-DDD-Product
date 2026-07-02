import Exception from 'src/Common/Domain/Exceptions/Exception'

type Result<V, F = Exception> = { ok: V } | { failure: F }

export default Result
