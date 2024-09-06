'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { FC, Fragment, PropsWithoutRef, ReactNode, useCallback } from 'react'

type Option = {
    key: string
    text: ReactNode
    onSelected: () => void
}

type DropdownButtonsProps = {
    options: Option[]
    buttonText: string | ReactNode
}

export const DropdownButtons: FC<PropsWithoutRef<DropdownButtonsProps>> = ({ options, buttonText }) => {

    const onSelected = useCallback((selected: Option['key']) => {
        const option = options.find((option) => option.key === selected)
        if (option) {
            option.onSelected()
        }
    }, [options])

    return (
        <Menu>
            <div className='relative mt-1 w-full'>
                <MenuButton className='relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm ring-1 ring-black ring-opacity-10'>
                    <div className='flex'>
                        <span className='ml-2 block truncate'>{buttonText}</span>
                        <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                            <ChevronDownIcon
                                className='size-5 text-gray-400 ui-open:rotate-180'
                                aria-hidden='true'
                            />
                        </span>
                    </div>
                </MenuButton>
                <MenuItems className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-10 focus:outline-none sm:text-sm'>
                    {options.map(({ key, text }) => (
                        <MenuItem
                            key={key}
                        >
                            {({ }) => (
                                <span className={`block p-2 truncate font-normal`} onClick={() => onSelected(key)}>
                                    {text}
                                </span>
                            )}
                        </MenuItem>
                    ))}
                </MenuItems>
            </div>
        </Menu>
    )
}
