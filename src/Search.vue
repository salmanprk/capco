<template>
  <!-- <div class="container-fluid"> -->
    <b-container fluid>
    <br>
    <b-jumbotron header="Capco Aziz" lead="New Travel App for Capco Aziz">
    <!-- <p>For more information visit website</p> -->
    <b-container fluid class="bv-example-row">
      <!-- <b-alert class="alert-link" show>Choose Origin City and Destination to Find Lowest Price</b-alert> -->
        
       <!-- <b-alert class="alert-link" show>Low Fare Search - {{ this.selectedValue}}</b-alert> -->
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
             <span class="text-primary chosen" v-if="origin_city"> Departure: {{ origin_city.cityCode }}</span>
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
            <span class="text-primary chosen" v-if="destination_city"> Destination: {{ destination_city.cityCode }}</span>
          </b-col>
        </b-row>
        <br>
        <!-- <b-button variant="primary" @click='checkInLink'>Test</b-button> -->
        <b-button variant="primary" @click='parseOffers'>Search</b-button>
        <br>
        <br>
        <!-- </b-container>

        <b-container class="bv-example-row"> -->
          

          
          <div v-if="flightLoaded">          
            <div v-for="(flight, index) in flights" :key="index">
          
                <b-card border-variant="light" class="flightCard">
                  <b-row>
                    <b-col>
                      <h5>Price: Base <b-badge variant="primary">${{flight.price}}</b-badge> + Tax <b-badge variant="danger">${{flight.tax}}</b-badge></h5>
                    </b-col>
                    <!-- <b-col>
                      <p>This flight has {{flight.flightLegDetails.length}} legs.</p>
                    </b-col> -->
                  </b-row>
          
                      <b-tabs card>
                      <div class="" v-for="(flightLeg, key) in (flight.flightLegDetails)" :key="key">
                         
                            <b-tab :title="key+1" active>
                              <b-card-title>Leg: {{key+1}} of {{flight.flightLegDetails.length}}</b-card-title>
                              <b-card-text>
                                <div class="">
                                  <b-row>
                                    <b-col><p><span class="badge badge-primary">Departure</span><h4>{{ flightLeg.flightDetail1.departure.iataCode }}</h4> at {{flightLeg.flightDetail1.departure.at}}</p>
                                    </b-col>
                                    <b-col><p><span class="badge badge-info">Arrival</span><h4>{{ flightLeg.flightDetail1.arrival.iataCode}}</h4> in Terminal: {{flightLeg.flightDetail1.arrival.terminal}} at {{flightLeg.flightDetail1.arrival.at}}</p>
                                  </b-col>
                                  </b-row>
                                  <p>
                                    <span class="badge badge-secondary">Duration</span>
                                  </p> 
                                  <h5>{{flightLeg.flightDetail1.duration}}</h5>
                                  
                                  <blockquote class="blockquote">
                                    <footer class="blockquote-footer">operated by <cite title="Source Title">{{ flightLeg.flightDetail1.carrierCode}}</cite> - Flight No: {{flightLeg.flightDetail1.number}} </footer>
                                  </blockquote>
                                  <b-btn variant="primary" @click="checkInLink(flightLeg.flightDetail1.carrierCode)">Book</b-btn>
                                </div>
                              </b-card-text>
                            </b-tab>           
                      </div>
                      </b-tabs>
                </b-card>
            <br>
          
          </div>
        </div>
        <div v-else>
          <div v-if="!isLoading" class="text-center">
            <h3>Enter your search...</h3>
          </div>
          <div v-else class="text-center">
            <b-spinner style="width: 5rem; height: 5rem;"  variant="primary" label="Text Centered"></b-spinner>
          </div>
        </div>
        <br>
        <!-- <b-button variant="primary" @click='searchDates'>Cheapest Fares</b-button>
        <br>
        <br>
        <template>
           <div>
             <b-table hover :items="offers" :fields="fields"></b-table>
            </div>
        </template>
        <br> -->
        <br>
        </b-container>
        
    </b-jumbotron>
    </b-container>
    
</template>

<script>
import { CoolSelect } from "vue-cool-select";
import { airlineCodeLookup, airlineCheckIn, lowFareSearch, cheapDateSearch, ajaxFindCountry, amadeus, Amadeus } from './amadeus.js';
export default {
  components: {
    CoolSelect
  },
  //   name: 'app',
  data() {
    return {
      selected: null,
      flightLoaded: false,
      isLoading: false,
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
        flights: []
       
      // offers: [
      //     { date: 40, origin: },
      //     { date: 40, origin: },
      //     { date: 40, origin: },
      //     { date: 40, origin: }
      // ],

    };
  },
   computed: {
    // a computed getter
    codeLook: function (arg) {
      // `this` points to the vm instance
      return this.checkCode(arg)
    }
  },
  methods: {
    checkInLink(arg) {
        airlineCheckIn(arg)
        .then(response => {
          console.log(response.data[0].href)
          console.log(window.location.href)
          window.location.href = response.data[0].href
        })
        .catch(err => console.log(err))
      },
      checkCode(arg) {
        airlineCodeLookup(arg)
        .then(response => {

          console.log(response)
          return response.data[0].businessName
        })
        .catch(err => console.log(err))
      },
      parsA(data) {
        var objArray = []
        //console.log(data)
        objArray = data.map(item =>{
          var offerItem = item.offerItems
          //console.log(offerItem)
          var price = offerItem[0].price.total //need to store
          var tax = offerItem[0].price.totalTaxes// need to store
          //
          //console.log(offerItem[0].services[0])
          //
          var segments = offerItem[0].services[0].segments
          var flightLegDetail = [] //need to store
          var count = 0
          segments.forEach(flightLeg => {
            var flightDetail1 = flightLeg.flightSegment
            var flightDetail2 = flightLeg.pricingDetailPerAdult
            flightLegDetail.push( {flightDetail1, flightDetail2} )
            count++
          })
          var store = {
            "flightLegDetails": flightLegDetail,
            "price": price,
            "tax": tax
          }
          return store
        })
        return objArray
      },
      parseOffers(arg) {
        this.flightLoaded = false
        this.isLoading = true;
        var obj = Date.parse(this.selectedValue)
        var year = this.selectedValue.getFullYear()
        var month = this.selectedValue.getMonth()+1
        var date = this.selectedValue.getDate()
        var full_date = `${year}-${month}-${date}`
        console.log("IN")
        lowFareSearch(this.origin_city.cityCode, this.destination_city.cityCode, full_date)
        .then(response => {
          var obj = response.data.slice(0,10)
          console.log("Low Fare Response")
          console.log(obj)
          var store = this.parsA(obj)
          console.log("Final Results")
          //console.log(store)
          this.flights = store
          console.log(this.flights)
          this.flightLoaded = true
          this.isLoading = false
        })
        .catch(err => console.log(err))
        
      },
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
    //  asyncFind1 (query) {
    //    this.isLoading = true
    //    ajaxFindCountry(query).then(response => {
    //     console.log("Name of City:" + response[0].address.cityName)
    //     var arry = []
    //     response.forEach(el => {
    //         // looks for AIRPORTS
    //         if (el.subType == "AIRPORT") {
    //             arry.push({"name": el.detailedName, "iataCode": el.iataCode, "full": `${el.name}, ${el.address.cityName}, ${el.address.stateCode || null}, ${el.address.countryName}`  })
    //         }
    //         //arry.push(el.name)
            
    //      })
    //      console.log("Locations Array: " + arry)
    //      this.countries = arry
    //      this.isLoading = false           
    //    }).catch(err => console.log(err))
    //  },
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
         //console.log(this.items)
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
  padding: 5px;
}
.flightCard {
  font-size: 15px;
}
.detailsCard {
  font-size: 12px;
  text-align: left;
  max-height: 400px;
}
input {
  border: none;
}
.badge {
  font-size:15px;
}
</style>