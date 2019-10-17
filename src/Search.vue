<template>
  <div class="container">
     <b-jumbotron header="Capco Aziz" lead="New Travel App for Capco Aziz">
    <p>For more information visit website</p>
  
    <b-container class="bv-example-row">
        <b-row>
            <b-col>Origin</b-col>
            <b-col>-</b-col>
            <b-col>Destination</b-col>
        </b-row>
        <br>
        <b-row>
            <cool-select class="searchinput" v-model="selected" :items="items" :loading="loading" item-text="full" placeholder="Choose Departure City" disable-filtering-by-search @search="onSearch">
                <template slot="no-data">
                    {{
                    noData
                        ? "No information found by request."
                        : "We need at least 2 letters to search."
                    }}
                </template>
                <template slot="item" slot-scope="{ item }">
                    <div class="item">

                    <div>
                        <span class="item-name"> {{ item.full }} </span> <br />
                        <!-- <span class="item-domain"> {{ item.domain }} </span> -->
                    </div>
                    </div>
                </template>
            </cool-select>
        </b-row>
        <span>  {{ selected }}</span>
        <br>
        <b-button @click=''>Search</b-button>
    </b-container>
    </b-jumbotron>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { CoolSelect } from 'vue-cool-select'
import { ajaxFindCountry, amadeus, Amadeus } from './amadeus.js';
export default {
  //   name: 'app',
  components: {
    Multiselect,
    CoolSelect 
  },
  data() {
    return {
      selected: null,
      items: [],
      noData: false,
      loading: false
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
    onSearch(search) {
      const lettersLimit = 2;

      this.noData = false;
      if (search.length < lettersLimit) {
        this.items = [];
        this.loading = false;
        return;
      }
      this.loading = true;
      console.log("RUNS")
      ajaxFindCountry(search)
      .then(response => {
        var objectArray = []
        response.forEach(el => {
            // looks for AIRPORTS
            if (el.subType == "AIRPORT") {
                if (el.address.stateCode) {
                  objectArray.push({"name": el.detailedName, "iataCode": el.iataCode, "full": `${el.name}, ${el.address.cityName}, ${el.address.stateCode}, ${el.address.countryName}`  })

                } else {
                  objectArray.push({"name": el.detailedName, "iataCode": el.iataCode, "full": `${el.name}, ${el.address.cityName}, ${el.address.countryName}`  })

                }
            }  
         })
         
         this.items = objectArray
         this.loading = false;
         console.log(this.items)
         if (!this.items.length) this.noData = true;
      })
      .catch(err => console.log(err))
    }
}
}
</script>
<style scoped>
.item {
  display: flex;
  align-items: center;
 
}
.IZ-select__item {
  font-size: 0.8rem;
}
.item-name {
  font-size: 12px;
}
.searchinput {
  font-size: 0.7rem;
}
</style>