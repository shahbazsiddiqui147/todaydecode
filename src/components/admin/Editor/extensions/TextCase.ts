import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        textCase: {
            /**
             * Set the text case
             */
            setTextCase: (caseType: 'uppercase' | 'lowercase' | 'capitalize' | 'small-caps' | 'sentence' | 'none') => ReturnType,
        }
    }
}

export const TextCase = Extension.create({
    name: 'textCase',

    addOptions() {
        return {
            types: ['textStyle'],
        }
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    textTransform: {
                        default: null,
                        parseHTML: element => element.style.textTransform,
                        renderHTML: attributes => {
                            if (!attributes.textTransform) {
                                return {}
                            }

                            return {
                                style: `text-transform: ${attributes.textTransform}`,
                            }
                        },
                    },
                    fontVariant: {
                        default: null,
                        parseHTML: element => element.style.fontVariant,
                        renderHTML: attributes => {
                            if (!attributes.fontVariant) {
                                return {}
                            }

                            return {
                                style: `font-variant: ${attributes.fontVariant}`,
                            }
                        },
                    },
                },
            },
        ]
    },

    addCommands() {
        return {
            setTextCase: (caseType) => ({ chain, state }) => {
                if (caseType === 'sentence') {
                    const { from, to } = state.selection
                    const text = state.doc.textBetween(from, to)
                    const transformedText = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
                    return chain().insertContent(transformedText).run()
                }

                if (caseType === 'small-caps') {
                    return chain()
                        .setMark('textStyle', { fontVariant: 'small-caps', textTransform: null })
                        .run()
                }

                if (caseType === 'none') {
                    return chain()
                        .setMark('textStyle', { fontVariant: null, textTransform: null })
                        .run()
                }

                return chain()
                    .setMark('textStyle', { textTransform: caseType, fontVariant: null })
                    .run()
            },
        }
    },
})
