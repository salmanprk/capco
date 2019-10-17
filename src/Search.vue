<template>
  <div>
    <h3>New App for Capco Aziz</h3>
    <b-container class="bv-example-row">
        <b-row>
            <b-col>Origin</b-col>
            <b-col>-</b-col>
            <b-col>Destination</b-col>
        </b-row>
        <br>
        <b-row>
            <b-col>
                <div>
                    <label class="typo__label" for="ajax">Departure Airport</label>
                    <multiselect v-model="firstAirport" id="ajax" label="full" track-by="iataCode" placeholder="Type to search" open-direction="bottom" :options="countries" :multiple="false" :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="true" :close-on-select="false" :options-limit="300" :limit="3" :limit-text="limitText" :max-height="300" :show-no-results="false" :hide-selected="true" @search-change="asyncFind1">
                        <!-- <template slot="tag" slot-scope="{ option, remove }"><span class="custom__tag">J<span>{{ option.name }}</span><span class="custom__remove" @click="remove(option)">R❌</span></span></template>
                        <template slot="clear" slot-scope="props">
                        <div class="multiselect__clear" v-if="selectedCountries.length" @mousedown.prevent.stop="clearAll(props.search)"></div>
                        </template> -->
                        <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
                    </multiselect>
                    <pre class="language-json"><code>{{ firstAirport  }}</code></pre>
                </div>
            </b-col>
            <b-col>2 of 3</b-col>
            <!-- <b-col>
                <multiselect v-model="selectedCountries" id="ajax" label="name" track-by="code" placeholder="Type to search" open-direction="bottom" :options="countries" :multiple="true" :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="false" :close-on-select="false" :options-limit="300" :limit="3" :limit-text="limitText" :max-height="600" :show-no-results="false" :hide-selected="true" @search-change="asyncFind">
                        <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
                    </multiselect>
                    <pre class="language-json"><code>{{ selectedCountries  }}</code></pre>

            </b-col> -->
        </b-row>
        <b-button @click='clickOne'>Search</b-button>
    </b-container>
    
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { ajaxFindCountry, amadeus, Amadeus } from './amadeus.js';
export default {
  //   name: 'app',
  components: {
    Multiselect
  },
  data() {
    return {
    firstAirport: [],
      selectedCountries: [],
      countries: [],
      isLoading: false
    };
  },
  methods: {

      limitText (count) {
        return `and ${count} other countries`
     },
     asyncFind1 (query) {
       this.isLoading = true
       ajaxFindCountry(query).then(response => {
        console.log("Name of City:" + response[0].address.cityName)
        var arry = []
        response.forEach(el => {
            // looks for AIRPORTS
            if (el.subType == "AIRPORT") {
                arry.push({"name": el.detailedName, "iataCode": el.iataCode, "full": `${el.name}, ${el.address.cityName}, ${el.address.stateCode || null}, ${el.address.countryName}`  })
            }
            //arry.push(el.name)
            
         })
         console.log("Locations Array: " + arry)
         this.countries = arry
         this.isLoading = false           
       }).catch(err => console.log(err))
     },
     clearAll () {
       this.firstAirport = []
     }
  }
};
</script>
<style scoped>
.border1 {
    border-color: blue
}
</style>