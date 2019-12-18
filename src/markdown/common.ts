const hasProp = Object.prototype.hasOwnProperty;

export const tocRegexp = /^\[\[toc\]\]/im;

export const isSpace = (code) => {
    switch (code) {
        case 0x09:
        case 0x20:
            return true;
    }
    return false;
}

export const slugify = (s: string) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));

export const uniqueSlug = (slug: string, slugs) => {
    let uniq: string = slug;
    let i: number = 2;
    while (hasProp.call(slugs, uniq)) uniq = `${slug}-${i++}`;
    slugs[uniq] = true;
    return uniq;
};
