
function bigint_or_number (x) {
	if (typeof(x) === 'number') { return nbv(x); }
	else { return x; }
};

function buffer_to_ui8a (b) {
	var l = b.length;
	var ret = new Uint8Array(l);
	for (var i = 0; i < l; i++) {
		ret[i] = b.readUInt8(i);
	}
	return ret;
};

// Match this function to the bigint/bignum native JS interface
// in node.  Typically we're doing it the other way around.
BigInteger.prototype.fromBuffer = function (buf) {
    // the last 'true' is for 'unsigned', our hack to jsbn.js to 
    // shut off DER-integer interpretation
	this.fromString(buffer_to_ui8a(buf), 256, true);
	return this;
};

BigInteger.fromBuffer = function (buf) {
	var ret = nbi();
	ret.fromBuffer(buf);
	return ret;
};

BigInteger.random_nbit = function (nbits, rf) {
	return new BigInteger(nbits, rf);
};

BigInteger.prototype.inspect = function () {
	return "<BigInteger/pure " + this.toString() + ">";
};

// For compatability with the 'bigi' package used by ecurve
BigInteger.fromHex = function (s) {
	return new BigInteger(s, 16);
};

BigInteger.valueOf = function (x) {
	return bigint_or_number(x);
};

BigInteger.prototype.toBuffer = function (size) {
	var x;
	if (!size) { size = 0; }
	if (this.signum() == 0) { x = []; }
	else { x = this.toByteArray(); }
	var ret = new Buffer(x);
	if ((diff = size - x.length) > 0) {
		var pad = new Buffer(diff);
		pad.fill(0);
		ret = Buffer.concat([pad,ret]);
	}
	return ret;
};

BigInteger.prototype.toDERInteger = function () {
	return new Buffer(this.toByteArray(true));
};

BigInteger.fromDERInteger = function (buf) {
	var x = nbi();
	x.fromString(buffer_to_ui8a(buf), 256, false);
	return x;
};

module.exports = { 
	BigInteger : BigInteger,
	nbi : nbi,
	nbv : nbv,
	Montgomery : Montgomery,
	Classic : Classic,
	nbits : nbits
};
