var eventBus = new Vue();

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
    },
    template: `        <div class="product">
    <div class="product-image">
        <img :src="image" :alt="altText" />
    </div>
    <div class="product-info">
        <h1>
            {{ title }}
        </h1>
        <!-- <a :href="link" target="_blank">More products like this</a> -->
        <p v-if="inStock">In Stock</p>
        <p v-else>Out of Stock</p>
        <p>Shipping {{ shipping }}</p>
        <ul>
            <li v-for="detail in details">{{detail}}</li>
        </ul>
        <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box" :style="{ backgroundColor: variant.variantColor}"
            @mouseover="updateProduct(index)">
            <!-- <p >{{ variant.variantColor}}</p> -->
        </div>

        <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock}"> Add to Cart </button>


    </div>
    <product-tabs :reviews="reviews"></product-tabs>

</div>`,
    data() {
        return {
            brand: 'Vue Mystery',
            product: 'Socks',
            selectedVariant: 0,
            altText: 'A pair of socks',
            details: ["80% Cotton", "20% Polyster", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10,
                },
                {
                    variantId: 2232,
                    variantColor: "blue",
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 0,
                }
            ],
            reviews: [],
            link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
            description: 'A pair of warm, fuzzy socks',
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)

        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return 2.99;
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        })
    },

})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the following errors:</b>
            <ul>
                <li v-for="error in errors">{{error}}</li>
            </ul>
        </p>
        <p>
            <label for="name">Name: </label>
            <input id="name" v-model="name">
        </p>
        <p>
            <label for="review">Review: </label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
            <label for="rating">Rating: </label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>   
            </select>
        </p>    
        <button type="submit">Submit</button>    
    </form>    
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                }
                eventBus.$emit('review-submitted', productReview);
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
            }
        }
    },
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true,
        }
    },
    template: `
        <div>
            <span class="tab" v-for="(tab, index) in tabs" :class="{ activeTab: selectedTab === tab}"
            :key="index" @click="selectedTab = tab">
            {{ tab }}
            </span>

            <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                    <p>{{review.name}}</p>
                    <p>{{review.rating}}</p>
                    <p>{{review.review}}</p>
                </li>
            </ul>
        </div>    
        <product-review v-show="selectedTab === 'Make a Review'"></product-review>            
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        }
    }

})