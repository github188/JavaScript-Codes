<template>
    <div class="star" :class="starType">
        <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
    </div>    
</template>

<script>

const STAR_COUNT = 5;
const STAR_ON = 'on';
const STAR_HALF = 'half';
const STAR_OFF = 'off';

export default {
    props: {
        size: {
            type: Number
        },

        score: {
            type: Number
        }
    },

    computed: {
        starType() {
            return 'star-' + this.size;
        },

        itemClasses() {
            let result = [];
            // limit max score to STAR_COUNT
            let score = this.score > STAR_COUNT ? STAR_COUNT : this.score;
            let mod = this.score % STAR_COUNT;
            let onStarCount = (
                score + 1 / 2 >= STAR_COUNT
                ? STAR_COUNT
                : Math.floor(score)
            );
            let hasHalf = mod * 2 > 1;

            // push star on
            for (let i = 0; i < onStarCount; i++) {
                result.push(STAR_ON);
            }

            // push half
            if (hasHalf) { result.push(STAR_HALF); }

            // push off
            while (result.length < STAR_COUNT) {
                result.push(STAR_OFF);
            }

            return result;
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

@import '../../common/stylus/mixin.styl'

.star
    font-size: 0
    .star-item
        display: inline-block
        background-repeat: no-repeat
    &.star-48
        .star-item
            width: 20px
            height: 20px
            margin-right: 22px
            background-size: 20px 20px
            &:last-child
                margin-right: 0
            &.on
                bg-img('imgs/star48_on')
            &.half
                bg-img('imgs/star48_half')
            &.off
                bg-img('imgs/star48_off')
    &.star-36
        .star-item
            width: 15px
            height: 15px
            margin-right: 6px
            background-size: 15px 15px
            &:last-child
                margin-right: 0
            &.on
                bg-img('imgs/star36_on')
            &.half
                bg-img('imgs/star36_half')
            &.off
                bg-img('imgs/star36_off')
    &.star-24
        .star-item
            width: 10px
            height: 10px
            margin-right: 3px
            background-size: 10px 10px
            &:last-child
                margin-right: 0
            &.on
                bg-img('imgs/star24_on')
            &.half
                bg-img('imgs/star24_half')
            &.off
                bg-img('imgs/star24_off')
     
</style>
