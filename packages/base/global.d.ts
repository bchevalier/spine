declare namespace GlobalMixins
{
    interface Spine {

    }
}

declare module '*.frag' {
    const value: string;

    export default value;
}

declare module '*.vert' {
    const value: string;

    export default value;
}
