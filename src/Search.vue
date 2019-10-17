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
          <b-col>
            <label>Choose Date</label>
            <v-date-picker class="form-control" mode='single' v-model='selectedValue'></v-date-picker>
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
        <b-button variant="primary" @click='searchDates'>Cheapest Fares</b-button>
        <br>
        <br>
        <template>
           <div>
             <b-table striped hover :items="offers" :fields="fields"></b-table>
            </div>
        </template>
        <br>
        <br>
        <b-button variant="primary" @click='searchFares'>Search Dates</b-button>
        <br>
        <br>
        <b-alert class="alert-link" show>Low Fare Search - {{ this.selectedValue}}</b-alert>
        <template>
           <div>
             <b-table striped hover :items="alloffers"></b-table>
            </div>
        </template>
    </b-container>
    </b-jumbotron>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { CoolSelect } from 'vue-cool-select'
import { lowFareSearch, cheapDateSearch, ajaxFindCountry, amadeus, Amadeus } from './amadeus.js';
export default {
  //   name: 'app',
  components: {
    Multiselect,
    CoolSelect 
  },
  data() {
    return {
      selected: null,
      selectedValue: new Date(),
      items: [],
      noData: false,
      loading: false,
      list: null,
      origin_city: null,
      destination_city: null,
      offers: [],
      alloffers: [],
      fares: [
          { date: 40, origin: 'Dickerson', destination: 'Macdonald', 'price': '123' },
          { date: 40, origin: 'Dickerson', destination: 'Macdonald', 'price': '123'},
          { date: 40, origin: 'Dickerson', destination: 'Macdonald', 'price': '123' },
          { date: 40, origin: 'Dickerson', destination: 'Macdonald', 'price': '123' }
      ],
      
      fields: [
          {
            key: 'date',
            sortable: true
          },
          {
            key: 'origin',
            sortable: false
          },
          {
            key: 'price',
            // label: 'Person age',
            sortable: true,
            // Variant applies to the whole column, including the header and footer
            variant: 'primary'
          }
        ],
         fields2: [
          {
            key: 'Date',
            sortable: true
          },
          {
            key: 'Price',
            sortable: true
          },
          {
            key: 'Carrier',
            // label: 'Person age',
            sortable: true,
            // Variant applies to the whole column, including the header and footer
            //variant: 'primary'
          },
          {
            key: 'Duration'
          },
          {
            key: 'Departure'
          },
          {
            key: 'Arrival'
          }
        ],
       
      // offers: [
      //     { date: 40, origin: },
      //     { date: 40, origin: },
      //     { date: 40, origin: },
      //     { date: 40, origin: }
      // ],

    };
  },
  methods: {
      searchFares() {
        var obj = Date.parse(this.selectedValue)
        var year = this.selectedValue.getFullYear()
        var month = this.selectedValue.getMonth()+1
        var date = this.selectedValue.getDate()
        var full_date = `${year}-${month}-${date}`
        console.log(full_date)
        lowFareSearch(this.origin_city.cityCode, this.destination_city.cityCode, full_date)
        .then(response => {
          //console.log(response)
          var objArray = []
          var counter = 0 
          response.data.forEach(function(item) {
            
             //objArray.push({'date': item.departureDate, 'origin': item.origin, 'destination': item.destination, 'price': item.price.total})
              
            if (counter < 20) {
              objArray.push({'date':  item.offerItems[0].services[0].segments[0].flightSegment.departure.at, 'price': `$`+  item.offerItems[0].price.total, 'carrier':  item.offerItems[0].services[0].segments[0].flightSegment.carrierCode, 'duration':  item.offerItems[0].services[0].segments[0].flightSegment.duration, 'departure':1, 'arrival': 2})
              counter++
            }
            
          })
            
            this.alloffers = objArray
            console.log(this.alloffers)
        })
        .catch(err => {
          console.log(err)
        })
      },
      searchDates() {
        cheapDateSearch(this.origin_city.cityCode, this.destination_city.cityCode)
        .then(response => {
          console.log(`Cheapest Dates between ${this.origin_city.cityCode} and ${this.destination_city.cityCode}  ${response}`)
          var objArray = []
          var counter = 0 
          response.data.forEach(function(item) {
            
             //objArray.push({'date': item.departureDate, 'origin': item.origin, 'destination': item.destination, 'price': item.price.total})
              
            if (counter < 20) {
              objArray.push({'date': item.departureDate, 'origin': item.origin, 'destination': item.destination, 'price': `$`+ item.price.total})
              counter++
            }
            
          })
            console.log(objArray)
            this.offers = objArray
          })
        .catch(err =>  console.log(`Failed: ${err}`) )
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