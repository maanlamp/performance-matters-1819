export function timeout (timeout, code = 200, message = "OK") {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({status: code, statusText: message});
		}, timeout);
	});
}

export async function clearElement (element, interval = 10, reverse = false) {
	while (element.childNodes.length) {
		if (reverse) element.firstChild.remove();
		else element.lastChild.remove();
		await timeout(interval);
	}
}

export function optionalChain (source, rest, alternative) {
	//support obj[property] notation in rest
	const chain = rest.split(/\./);
	let obj = source[chain.shift()];
	try {
		for (const property of chain) obj = obj[property];
		return (obj !== undefined)
			? obj
			: alternative;
	} catch {
		return alternative;
	}
}

export function truncateString (string, length, pattern = "...") {
	return (string.length > length)
		? string
			.slice(0, length)
			.trim()
			+ pattern
		: string;
}

export function compareStrings (strA, strB) {
	//Should make this smarter
	return Math.abs(Math.min(strA.length, strB.length) - Math.max(strA.length, strB.length));
}

export function repeat (count, func) {
	let i = 0;
	while (i++ < count) func(i);
}