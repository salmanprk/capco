<template>
  <div class="container">
     <b-jumbotron header="Capco Aziz" lead="New Travel App for Capco Aziz">
    <!-- <p>For more information visit website</p> -->
    <b-alert class="alert-link" show>Choose Origin City and Destination to Find Lowest Price</b-alert>
    <b-container class="bv-example-row">
       
        <b-row>
          <b-col>
            <label>Origin</label>
            <cool-select class="searchinput" v-model="selected" :items="items" :loading="loading" item-text="full" placeholder="Choose Departure City" disable-filtering-by-search @search="onSearch" @select="ori">
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
             <span class="chosen" v-if="origin_city"> Departure: {{ origin_city.cityCode }}</span>
             <!-- <span v-else>You have not selected your origin</span> -->
          </b-col>
          <!-- 2nd Lookup -->
          <b-col>
            <label>Destination</label>
            <cool-select class="searchinput" v-model="list" :items="items" :loading="loading" item-text="full" placeholder="Choose Destination City" disable-filtering-by-search @search="onSearch" @select="dest">
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
            <span class="chosen" v-if="destination_city"> Destination: {{ destination_city.cityCode }}</span>
          </b-col>
        </b-row>
        
        
        <br>
        <b-button @click='searchDates'>Search</b-button>
        <br>
        <br>
        <b-alert class="alert-link" show>Low Fare Search for a given date</b-alert>
    </b-container>
    </b-jumbotron>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { CoolSelect } from 'vue-cool-select'
import { cheapDateSearch, ajaxFindCountry, amadeus, Amadeus } from './amadeus.js';
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
      loading: false,
      list: null,
      origin_city: null,
      destination_city: null

    };
  },
  methods: {
      searchDates() {
        cheapDateSearch(this.origin_city.cityCode, this.destination_city.cityCode)
        .then(response => {console.log(`Cheapest Dates between ${this.origin_city} and ${this.destination_city}  ${response}`)})
        .catch(err => console.log(err))
      },
      dest(select) {
        this.destination_city = select
      },
      ori(select) {
        this.origin_city = select
      },
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
                  objectArray.push({ "cityCode": el.address.cityCode, "countryCode": el.address.countryCode,  "name": el.detailedName, "iataCode": el.iataCode, "full": `${el.name}, ${el.address.cityName}, ${el.address.stateCode}, ${el.address.countryName}`  })

                } else {
                  objectArray.push({ "cityCode": el.address.cityCode, "countryCode": el.address.countryCode,  "name": el.detailedName, "iataCode": el.iataCode, "full": `${el.name}, ${el.address.cityName}, ${el.address.countryName}`  })

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
.chosen {
  font-size: 14px;
  color: blue;
  padding: 1px;
}
</style>