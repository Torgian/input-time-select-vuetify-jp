# input-time-select-vuetify-jp
An input time selector made for health care industry in Japan. Vue / Vuetify

Thanks for your interest in this time selector!

I created this because of a very specific work requirement.

We needed a time selector that was tailored for the health care industry in Japan.
Scheduling shifts for nurses is quite different from your typical 9AM to 5PM system.
Many shifts may start with your typical 0800 starting time. Or, they might start at 2000 ( 8 p.m.)

And how does a nurse schedule her shift if it starts at 2000 and ends at 0800 the next morning?
Well, in Japan at least, they will write 2000 - 3200!
However, they may also write it as the following: 翌800, or よく８００, which is short-hand for
"eight oclock the next day".

And in case you're wondering, that `８００` above is zenkaku. If we sent this in a POST request, this would throw errors, so obviously we can't have zenkaku. Instead of restricting the user from using zenkaku, @malikolivier created a zenkaku to hankaku function. This takes numbers written in zenkaku and converts them into a readable form (for the computer at least).

This time selector was made to be keyboard and mouse navigatable, and you can type in numbers in each input.

### Props
```
label: String,
disabled: Boolean,
sixtyMinuteRange: Boolean,
dark: Boolean,
range48: Boolean,
hideDetails: Boolean,
suffix: Boolean,
```
- `sixtyMinuteRange` When true, this returns a list of numbers from 1 - 60 for the minute input. Default is fiveMinuteRange, which returns a range of numbers from 0 to 60, in five minute increments.
- `range48` When true, returns a range from 0-47, with 24-47 using 翌０ー翌２３. Default is 00-23.
- `dark` Dark mode.
- `suffix` The suffix. Typically this can be 分　or 時 in Japanese.


### Requirements
All that's required is Vue and Vuetify! You can go to the [Vuetify] page for installation instructions.

```
"dependencies": {
    "vue": "^2.6.11",
    "vuetify": "^2.4.0"
},
 ```

### Contributors:

[Me!]

[Malik Olivier]


### Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

## License

MIT



 [Vuetify]: <https://vuetifyjs.com/en/>
 [Malik Olivier]: <https://github.com/malikolivier>
 [Me!]: <https://github.com/Torgian>
