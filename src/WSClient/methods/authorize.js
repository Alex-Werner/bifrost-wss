export default function authorize(_accessToken) {
    const accessToken = _accessToken ?? this.headers['access_token'];
    if (!accessToken) {
        throw new Error('Missing access_token')
    }
    this.send({
        cmd: 'authorize',
        token: this.headers['access_token']
    })
}
