(defproject limelight-yardstick "0.1.0-SNAPSHOT"
  :description "Movie/people database with Google authentication"
  :url "https://limelight-yardstick.fly.dev"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.11.1"]
                 ;; Web framework
                 [ring "1.10.0"]
                 [ring/ring-defaults "0.4.0"]
                 [ring/ring-jetty-adapter "1.10.0"]
                 [ring/ring-json "0.5.0"]
                 [compojure "1.7.1"]
                 ;; Database
                 [com.github.seancorfield/next.jdbc "1.3.909"]
                 [org.postgresql/postgresql "42.7.1"]
                 [com.zaxxer/HikariCP "5.1.0"]
                 ;; Auth & sessions
                 [buddy/buddy-auth "3.0.323"]
                 [buddy/buddy-sign "3.5.351"]
                 ;; HTTP & JSON
                 [clj-http "3.12.3"]
                 [org.clojure/data.json "2.4.0"]
                 [cheshire "5.11.0"]
                 ;; Logging
                 [org.clojure/tools.logging "1.2.4"]
                 [ch.qos.logback/logback-classic "1.4.11"]
                 ;; Utils
                 [com.google.guava/guava "32.1.3-jre"]]
  :main ^:skip-aot limelight-yardstick.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all
                       :jvm-opts ["-Dclojure.compiler.direct-linking=true"]}})
